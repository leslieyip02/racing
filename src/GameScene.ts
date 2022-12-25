import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { Track, Vehicle } from "./objects/objects";
import { IControls } from "./utils/interfaces";
import { track_0, track_8, track_s, track_y } from "../data/tracks/tracks";
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

        // this.track = new Track(this, track_0, debug);
        // this.track = new Track(this, track_8, debug);
        this.track = new Track(this, track_s, debug);
        // this.track = new Track(this, track_y, debug);

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