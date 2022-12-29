import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry"

export default class Satellite extends THREE.Mesh {
    direction: THREE.Vector3;
    rotationRate: THREE.Vector3;

    constructor(geometry: ConvexGeometry, material: THREE.Material,
        direction: THREE.Vector3, rotationRate: THREE.Vector3) {
        
        super(geometry, material);
        this.direction = direction;
        this.rotationRate = rotationRate;
    }

    update(dt?: number) {
        if (!dt)
            return;
            
        // apply centripetal force to direction vector
        let r = this.position.length();
        let v = this.position.clone().multiplyScalar(
            this.position.clone().dot(this.direction.clone()) / Math.pow(r, 2));
        this.direction = this.direction.sub(v);
        
        // orbit object around origin
        this.position.add(this.direction);
        this.position.normalize().multiplyScalar(r);

        // rotate mesh
        this.rotateX(this.rotationRate.x * dt);
        this.rotateY(this.rotationRate.y * dt);
        this.rotateZ(this.rotationRate.z * dt);
    }
}