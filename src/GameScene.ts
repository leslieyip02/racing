import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { Track, Vehicle } from "./objects/objects";
import { IControls } from "./utils/interfaces";
import { testTracks } from "../data/tracks/tracks";
import { bike, mustang } from "../data/vehicles/vehicles";

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

    constructor(debug?: boolean) {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.render(debug);

        // set up utilities
        // set up controls
        this.keysPressed = {};

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            this.keysPressed[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            this.keysPressed[e.key.toLowerCase()] = false;
        });

        // set up touch joystick
        // hide joystick if not touch device
        if (!("ontouchstart" in window ||
            navigator.maxTouchPoints > 0)) {
            
            document.getElementById("joystick").style.display = "none";
        } else {
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

    render(debug?: boolean) {
        // set up camera
        this.camera = new THREE.PerspectiveCamera(64, 
            this.width / this.height, 0.1, 1000);

        // set up renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("game") as HTMLCanvasElement,
            alpha: true
        });

        this.renderer.setSize(this.width, this.height);

        // set up camera orbital controls
        this.orbitals = new OrbitControls(this.camera, this.renderer.domElement);

        // set up glowing postprocessing
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this, this.camera));
        this.filter = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), 1.6, 0.1, 0.9);
        this.composer.addPass(this.filter);

        // set objects in the scene
        this.add(new THREE.AmbientLight(0xffffff));

        this.track = new Track(this, testTracks[0], debug);

        // let vehicle = new Vehicle(this, this.camera, bike, this.track.startPoint,
        //     this.track.startDirection, this.track.startRotation, debug);
        let vehicle = new Vehicle(this, this.camera, mustang, this.track.startPoint,
            this.track.startDirection, this.track.startRotation, debug);
        
        this.vehicles = [];
        this.vehicles.push(vehicle);

        if (debug) {
            // set up debugger
            this.debugger =  new GUI();
    
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

    update(dt?: number) {
        for (let vehicle of this.vehicles) {
            vehicle.update(this.keysPressed, this.track, dt);
        }

        this.track.update(dt);
    }
}