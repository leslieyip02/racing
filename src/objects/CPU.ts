import * as THREE from "three";
import { VehicleData } from "../utils/interfaces";
import Vehicle from "./Vehicle";
import Track from "./Track";

export default class CPU extends Vehicle {
    currentIndex: number;
    
    constructor(scene: THREE.Scene, vehicleData: VehicleData, 
        position: THREE.Vector3, direction: THREE.Vector3,
        rotation: THREE.Euler, debug?: boolean) {

        super(scene, vehicleData, position, direction, rotation, debug);
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

        this.thrust = 0.5;

        this.currentIndex = this.nextPointIndex(track);
        this.direction = track.pathVectors[this.currentIndex].clone();
        this.direction.y = 0;
        this.direction.normalize();

        this.velocity = this.direction.clone()
            .multiplyScalar(this.acceleration * this.thrust * dt * 50);
        this.velocity.add(this.gravity.clone().multiplyScalar(dt / 2));

        super.update(track, dt);
    }
}