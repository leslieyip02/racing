import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry"
import { Satellite, Track, Vehicle } from "./objects/objects";
import { randomVector } from "./utils/functions";
import { IControls } from "./utils/interfaces";
import { tracks, testTracks } from "../data/tracks/tracks";
import { bike, mustang, speeder } from "../data/vehicles/vehicles";

export default class GameScene extends THREE.Scene {
    debugger: GUI;

    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    filter: UnrealBloomPass;

    orbitals: OrbitControls;

    width: number;
    height: number;

    keysPressed: IControls;

    track: Track;
    vehicles: Array<Vehicle>;
    satellites: Array<Satellite>;

    constructor(debug?: boolean) {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.render(debug);

        // set up utilities
        // set up controls
        let isTouchDevice = "ontouchstart" in window || 
            navigator.maxTouchPoints > 0;
        this.setupControls(isTouchDevice);

        // set up window resizing
        window.addEventListener("resize", () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
            this.filter.setSize(this.width, this.height);
        }, false);
    }

    setupBackgroundEntities(number: number = 5000, 
        distance: number = 1000, offset: number = 200) {
        
        this.satellites = [];

        let material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        let geometry = new THREE.SphereGeometry(1, 4, 2);
        let mesh = new THREE.Mesh(geometry, material);

        for (let i = 0; i < number; i++) {
            let position = randomVector();
            
            // distribute stars in a spherical manner
            // prevent stars from concentrating around the corners of a cube
            while (position.length() < 0.5 && position.length() > 1)
                position = randomVector();

            position.normalize();
            position.multiplyScalar(distance + Math.random() * offset);

            // small chance to create a bigger geometry
            if (Math.random() < 0.05) {
                // create a convex hull from a random set of points
                let points = Array(Math.ceil(Math.random() * 8) + 8).fill(0)
                    .map(_ => randomVector().multiplyScalar(Math.random() * 20));
            
                let geometry = new ConvexGeometry(points);
                let direction = randomVector().multiplyScalar(0.1);
                let rotationRate = randomVector().multiplyScalar(0.001);
                let satellite = new Satellite(geometry, material, direction, rotationRate);
                satellite.position.set(position.x, position.y, position.z);

                // store satellites separetely so they can be updated
                this.satellites.push(satellite);
                this.add(satellite);
            } else {
                // standard star is a diamond shape
                let star = mesh.clone();
                star.position.set(position.x, position.y, position.z);
                this.add(star);
            }
        }
    }

    render(debug?: boolean) {
        // set up camera
        this.camera = new THREE.PerspectiveCamera(80, 
            this.width / this.height, 0.1, 3200);

        // set up renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("game") as HTMLCanvasElement,
            alpha: true
        });

        this.renderer.setSize(this.width, this.height);

        // set up camera orbital controls
        if (debug)
            this.orbitals = new OrbitControls(this.camera, this.renderer.domElement);

        // set up glowing postprocessing
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this, this.camera));
        this.filter = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), 1.6, 0.1, 0.9);
        this.composer.addPass(this.filter);

        // set objects in the scene
        this.add(new THREE.AmbientLight(0xffffff));

        let trackData = tracks[0];
        this.track = new Track(this, trackData, debug);

        if (!trackData.gridColor)
            this.setupBackgroundEntities();

        // let vehicle = new Vehicle(this, this.camera, bike, this.track.startPoint,
        //     this.track.startDirection, this.track.startRotation, debug);
        // let vehicle = new Vehicle(this, this.camera, mustang, this.track.startPoint,
        //     this.track.startDirection, this.track.startRotation, debug);
        let vehicle = new Vehicle(this, this.camera, speeder, this.track.startPoint,
            this.track.startDirection, this.track.startRotation, debug);
        
        this.vehicles = [];
        this.vehicles.push(vehicle);

        if (debug) {
            // set up debugger
            this.debugger = new GUI();
    
            const cameraGroup = this.debugger.addFolder("Camera");
            cameraGroup.add(this.camera, "fov", 0, 120);
            cameraGroup.add(this.camera, "zoom", 0, 1);
            cameraGroup.add(vehicle, "manualCamera");
            cameraGroup.open();
    
            const vehicleGroup = this.debugger.addFolder("Vehicle");
            vehicleGroup.add(vehicle.position, "x", -100, 100);
            vehicleGroup.add(vehicle.position, "y", -100, 100);
            vehicleGroup.add(vehicle.position, "z", -100, 100);
            vehicleGroup.open();
    
            const filterGroup = this.debugger.addFolder("Filter");
            filterGroup.add(this.filter, "strength", 0.0, 100.0);
            filterGroup.add(this.filter, "radius", 0.0, 5.0);
            filterGroup.add(this.filter, "threshold", 0.0, 1.0);
            filterGroup.open();
        }
    }

    setupControls(isTouchDevice?: boolean) {
        // set up keyboard controls
        this.keysPressed = {};

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            this.keysPressed[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            this.keysPressed[e.key.toLowerCase()] = false;
        });

        // hide joystick if not touch device
        if (!isTouchDevice) {
            document.getElementById("joystick").style.display = "none";
            return;
        }

        // set up touch joystick
        let vw = 0.01 * this.width;
        let vh = 0.01 * this.height;        
        let joystickRadius = 10 * vw;
        let joystickThreshold = 0.5 * joystickRadius;
        
        // get origin for joystick in px
        let x0 = 10 * vw + joystickRadius;
        let y0 = 50 * vh + joystickRadius;
        
        // keep track of all keys so they can be reset in the touch handler
        let controlKeys = ["w", "a", "s", "d", "shift"];

        document.getElementById("knob").addEventListener("touchmove", (e: TouchEvent) => {
            e.preventDefault();
            
            for (let key of controlKeys)
                this.keysPressed[key] = false;

            let dx = e.touches[0].clientX - x0;
            let dy = e.touches[0].clientY - y0;

            // mimic wasd controls with the joystick
            if (dy < -joystickThreshold)
                this.keysPressed["w"] = true;
            
            if (dx < -joystickThreshold)
                this.keysPressed["a"] = true;

            if (dy > joystickThreshold)
                this.keysPressed["s"] = true;
            
            if (dx > joystickThreshold)
                this.keysPressed["d"] = true;

            // clamp the displacement of the knob from the origin
            let r = Math.min(Math.sqrt(dx ** 2 + dy ** 2), joystickRadius);
            let a = Math.atan2(dy, dx);
            
            // add back 5vw offset to center 
            let top = 5 + r * Math.sin(a) / vw + "vw";
            let left = 5 + r * Math.cos(a) / vw + "vw";
            
            document.getElementById("knob").style.top = top;
            document.getElementById("knob").style.left = left;
        }, false);

        // reset knob position
        document.getElementById("knob").addEventListener("touchend", () => {
            for (let key of controlKeys)
                this.keysPressed[key] = false;

            document.getElementById("knob").style.top = "5vw";
            document.getElementById("knob").style.left = "5vw";
        }, false);
    }

    update(dt?: number) {
        for (let vehicle of this.vehicles)
            vehicle.update(this.keysPressed, this.track, dt);

        if (this.satellites)
            for (let satellite of this.satellites)
                satellite.update(dt);

        this.track.update(dt);
    }
}