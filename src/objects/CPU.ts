import * as THREE from "three";
import { Checkpoint, VehicleData } from "../utils/interfaces";
import Vehicle from "./Vehicle";
import Track from "./Track";

export default class CPU extends Vehicle {
    currentIndex: number;
    
    constructor(scene: THREE.Scene, vehicleData: VehicleData, 
        position: THREE.Vector3, direction: THREE.Vector3,
        rotation: THREE.Euler, checkpoint: Checkpoint, debug?: boolean) {

        super(scene, vehicleData, position, direction, 
            rotation, checkpoint, debug);
    }
    
    nextPointIndex(track: Track): number {
        let nearestDistance = Infinity;
        let nearestIndex = 0;

        if (this.currentIndex == track.pathPoints.length - 1)
            this.currentIndex = 0;

        for (let i = this.currentIndex; i < track.pathPoints.length; i++) {
            let distance = this.position.clone()
                .distanceToSquared(track.pathPoints[i].clone());
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = i;
            }
        }

        return nearestIndex;
    }

    update(track: Track, dt?: number) {
        if (!this.model || !this.hitbox || !track || !dt)
            return;

        // keep constant thrust for convenience
        this.thrust = 0.5;

        // update direciton manually instead of using controls
        this.currentIndex = this.nextPointIndex(track);
        this.direction = track.pathVectors[this.currentIndex].clone();

        // set velocity directly for greater control of the CPU's movement
        this.velocity = this.direction.clone()
            .multiplyScalar(this.acceleration * this.thrust * dt * 50);
        this.velocity.add(this.gravity.clone().multiplyScalar(dt * 0.75));

        // update collisions and position
        super.update(track, dt);

        // handle vehicle rotation
        let targetPosition = this.position.clone().add(this.direction.clone())
        this.model.lookAt(targetPosition);
        this.hitbox.lookAt(targetPosition);
    }
}