import * as THREE from "three";
import Track from "./Track";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Controls, VehicleData } from "../utils/interfaces";
import Vehicle from "./Vehicle";

export default class Player extends Vehicle {
    camera: THREE.PerspectiveCamera;
    manualCamera: boolean = false;
    orbitals?: OrbitControls;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera,
        vehicleData: VehicleData, position: THREE.Vector3, direction: THREE.Vector3,
        rotation: THREE.Euler, debug?: boolean, orbitals?: OrbitControls) {

        super(scene, vehicleData, position, direction, rotation, debug);
        this.camera = camera;
        this.orbitals = orbitals;
    }

    handleCameraMovement(forward: boolean, follow: boolean = true) {
        if (this.orbitals)
            this.orbitals.enabled = this.manualCamera;

        if (this.manualCamera)
            return;

        let targetPosition = this.position.clone();

        // the camera will only follow the vehicle if it is in bounds
        if (follow) {
            let cameraPosition = this.position.clone();
            let facingDirection = new THREE.Vector3(this.direction.x, 
                0, this.direction.z).normalize();

            if (!forward)
                facingDirection.negate();

            // set the camera to look further in front of the vehicle 
            targetPosition.add(facingDirection);

            // set camera behind and above vehicle
            let positionOffset = facingDirection.clone().multiplyScalar(3);
            cameraPosition.sub(positionOffset);
            cameraPosition.y += 1.5;
            this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        }

        this.camera.lookAt(targetPosition);
    }
    
    handleTrackCollision(track: Track) {
        super.handleTrackCollision(track, true);
    }

    handleInput(keysPressed: Controls, dt: number) {
        // thrust determines the extent of acceleration
        if (keysPressed["arrowup"])
            this.thrust = Math.min(this.thrust + 0.02, 1);
        
        if (keysPressed["arrowdown"])
            this.thrust = Math.max(this.thrust - 0.02, 0);
        
        if (keysPressed["arrowup"] || keysPressed["arrowdown"]) {
            let gaugeFill = document.getElementById("gauge-fill");
            
            let gaugeHeight = this.thrust * 40;
            gaugeFill.style.top = `${40 - gaugeHeight}vh`;
            gaugeFill.style.height = `${gaugeHeight}vh`;

            // create a gradient from green to yellow to red based on thrust
            // clamp values between #4bff00 and #ff4b00
            let red = this.thrust >= 0.5 ? 255 : Math.floor(this.thrust * 2 * 180) + 75;
            let green = this.thrust <= 0.5 ? 255 : Math.floor((1 - this.thrust) * 2 * 180) + 75;
            gaugeFill.style.backgroundColor = `#${red.toString(16)}${green.toString(16)}00`;

            keysPressed["arrowup"] = false;
            keysPressed["arrowdown"] = false;
        }

        // acceleration
        if (keysPressed["w"])
            this.velocity.add(this.direction.clone()
                .multiplyScalar(this.acceleration * this.thrust * dt));

        // deceleration
        if (keysPressed["s"] || keysPressed["shift"])
            this.velocity.sub(this.direction.clone()
                .multiplyScalar(this.deceleration * this.thrust * dt));

        // turning
        if (keysPressed["d"])
            this.turn(-this.turnRate * dt);
            
        if (keysPressed["a"])
            this.turn(this.turnRate * dt);

        // reset roll
        if (!(keysPressed["a"] || keysPressed["d"]))
            this.rotation.z *= 0.8;            
    }

    handleOutOfBounds() {
        super.handleOutOfBounds(true);
    }

    update(track: Track, dt?: number, keysPressed?: Controls) {
        if (!this.model || !this.hitbox || !track || !dt)
            return;
        
        this.handleInput(keysPressed, dt);
        super.update(track, dt);
        this.handleCameraMovement(!keysPressed["r"], this.isAlive);
    }
}