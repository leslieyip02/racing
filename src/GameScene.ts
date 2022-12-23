import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Track, Vehicle } from "./objects/objects";
import { IControls } from "./utils/interfaces";
import { track_0, track_8, track_y } from "../data/tracks/tracks";

export default class GameScene extends THREE.Scene {
    debugger: GUI;

    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;
    orbitals: OrbitControls;

    width: number;
    height: number;

    keysPressed: IControls;

    track: Track;
    vehicles: Array<Vehicle>;

    constructor() {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // set up camera
        this.camera = new THREE.PerspectiveCamera(64, 
            this.width / this.height, 0.1, 1000);

        // set up renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("game") as HTMLCanvasElement,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);

        // set objects in the scene
        this.add(new THREE.AmbientLight(0xffffff));

        // this.track = new Track(this, track_0, true);
        // this.track = new Track(this, track_8, true);
        this.track = new Track(this, track_y, true);

        let vehicle = new Vehicle(this, this.camera, this.track.startPoint,
            this.track.startDirection, this.track.startRotation, true);
        
        this.vehicles = [];
        this.vehicles.push(vehicle);

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

        // set up utilities
        // set up camera orbital controls
        this.orbitals = new OrbitControls(this.camera, this.renderer.domElement);
        
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
        }, false);
    }

    update(dt?: number) {
        for (let vehicle of this.vehicles) {
            vehicle.update(this.keysPressed, this.track, dt);
        }
    }
}