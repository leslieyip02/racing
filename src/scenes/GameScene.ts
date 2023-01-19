import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry"
import { CPU, Player, Track, Vehicle } from "../objects/objects";
import { Satellite } from "../decorations/decorations";
import { randomVector } from "../utils/geometry";
import { Controls } from "../utils/interfaces";
import { tracks } from "../../data/tracks/tracks";
import { speeders, bike, mustang } from "../../data/vehicles/vehicles";

export default class GameScene extends THREE.Scene {
    debugger: GUI;

    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    filter: UnrealBloomPass;

    orbitals: OrbitControls;

    width: number;
    height: number;

    keysPressed: Controls;

    track: Track;
    satellites: Array<Satellite>;
    
    player: Player;
    CPUs: Array<Vehicle>;

    countdown: number;
    finished: boolean;

    constructor(speederIndex: number, debug?: boolean) {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.render(speederIndex, debug);

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

        this.countdown = 0;
        this.finished = false;

        setTimeout(() => {
            document.getElementById("curtain").classList.remove("fade-in");
        }, 5000);
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

    render(speederIndex: number, debug?: boolean) {
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
        let light = new THREE.AmbientLight(0xffffff, 1);
        this.add(light);

        let trackData = tracks[0];
        this.track = new Track(this, trackData, debug);
        let firstCheckpoint = this.track.checkpoints[0];

        if (!trackData.gridColor)
            this.setupBackgroundEntities();
        
        if (isNaN(speederIndex))
            speederIndex = 0;

        let playerVehicleData = speederIndex == 3 ? bike : speederIndex == 4 ? mustang : 
            speederIndex > 4 || speederIndex < 0 ? speeders[0] : speeders[speederIndex];

        this.player = new Player(this, this.camera, playerVehicleData, 
            this.track.startPoint.clone(), this.track.startDirection.clone(), 
            this.track.startRotation.clone(), firstCheckpoint, debug, this.orbitals);
        this.player.handleCameraMovement(true, true);

        this.CPUs = [];
        let offset = 4;

        for (let i = 0; i < 3; i++) {
            if (i == speederIndex || this.CPUs.length == 3)
                continue;

            let startPoint = new THREE.Vector3(this.track.startPoint.x, 
                this.track.startPoint.y, this.track.startPoint.z + offset);

            this.CPUs.push(new CPU(this, speeders[i], startPoint,
                this.track.startDirection.clone(), 
                this.track.startRotation.clone(), firstCheckpoint, debug));

            offset *= -1;
        }

        if (debug) {
            // set up debugger
            this.debugger = new GUI();
    
            const cameraGroup = this.debugger.addFolder("Camera");
            cameraGroup.add(this.camera, "fov", 0, 120);
            cameraGroup.add(this.camera, "zoom", 0, 1);
            cameraGroup.add(this.player, "manualCamera");
    
            const vehicleGroup = this.debugger.addFolder("Vehicle");
            vehicleGroup.add(this.player.position, "x", -100, 100);
            vehicleGroup.add(this.player.position, "y", -100, 100);
            vehicleGroup.add(this.player.position, "z", -100, 100);
            
            const lightingGroup = this.debugger.addFolder("Lighting");
            lightingGroup.add(light, "intensity", 0, 2.0);

            const filterGroup = this.debugger.addFolder("Filter");
            filterGroup.add(this.filter, "strength", 0.0, 100.0);
            filterGroup.add(this.filter, "radius", 0.0, 5.0);
            filterGroup.add(this.filter, "threshold", 0.0, 1.0);

            this.debugger.close();
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

        window.addEventListener("wheel", (e: WheelEvent) => {
            this.keysPressed[`arrow${e.deltaY < 0 ? "up" : "down"}`] = true;
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
        let controlKeys = ["w", "a", "s", "d", "shift", "arrowup", "arrowdown"];
        
        let knob = document.getElementById("knob");
        knob.addEventListener("touchmove", (e: TouchEvent) => {
            e.preventDefault();
            
            for (let key of controlKeys)
                this.keysPressed[key] = false;

            let knobTouch = e.targetTouches[0];

            let dx = knobTouch.clientX - x0;
            let dy = knobTouch.clientY - y0;

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
        knob.addEventListener("touchend", () => {
            for (let key of controlKeys)
                this.keysPressed[key] = false;

            document.getElementById("knob").style.top = "5vw";
            document.getElementById("knob").style.left = "5vw";
        }, false);
        

        // set up touch thrust gauge
        let gauge = document.getElementById("gauge");
        let gaugeFill = document.getElementById("gauge-fill");
        gauge.addEventListener("touchmove", (e: TouchEvent) => {
            e.preventDefault();

            let gaugeTouch = e.targetTouches[0];

            let currentHeight = 50 * vh + parseInt(gaugeFill.style.top) * vh;
            let direction = gaugeTouch.clientY <= currentHeight ? "up" : "down";
            this.keysPressed[`arrow${direction}`] = true;
        });
    }

    handleCountdown() {
        if (this.countdown < 3000 || this.countdown > 7000)
            return document.getElementById("countdown").innerHTML = "";

        document.getElementById("countdown").innerHTML = this.countdown < 6000 ? 
            Math.ceil((6000 - this.countdown) / 1000).toString() : "GO!";
    }

    handleRaceFinish() {
        if (!this.finished) {
            document.getElementById("curtain").classList.add("long-fade-to-black");
            
            let rank = 1;
            for (let cpu of this.CPUs)
                if (cpu.laps > 2)
                    rank++;

            ["dashboard", "joystick", "gauge"].forEach((id: string) => {
                document.getElementById(id).style.display = "none";
            });

            setTimeout(() => {
                document.getElementById("finish-screen").style.display = "flex";

                let suffixes = ["st", "nd", "rd"]
                document.getElementById("finish-rank").innerHTML = rank.toString();
                document.getElementById("finish-rank-suffix").innerHTML = suffixes[rank - 1];

                document.getElementById("finish-time").innerHTML = 
                    `Time: ${this.track.getTimeString()}`;
            }, 3200);

            this.finished = true;
        }
    }

    // update game objects
    update(dt?: number) {
        if (!dt)
            return;

        // wait 3 seconds for fade in
        // wait 3 seconds for countdown
        this.countdown += dt;
        this.handleCountdown();
        if (this.countdown < 6000)
            return;

        // race ends after 2 laps
        if (this.player.laps > 2)
            this.handleRaceFinish();
        else
            this.track.update(dt);
        
        // update vehicles
        this.player.update(this.track, dt, this.keysPressed);

        for (let cpu of this.CPUs)
            cpu.update(this.track, dt);
        
        // scene decorations
        if (this.satellites)
            for (let satellite of this.satellites)
                satellite.update(dt);
    }
}