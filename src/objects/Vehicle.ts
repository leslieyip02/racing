import * as THREE from "three";
import Track from "./Track";
import { IControls } from "../utils/interfaces";
import { DebugVector } from "../utils/debug";

let defaultGravity = new THREE.Vector3(0, -0.008, 0);

export default class Vehicle {
    camera: THREE.PerspectiveCamera;
    manualCamera: boolean = false;

    position: THREE.Vector3;
    lastCheckpoint: THREE.Vector3;
    direction: THREE.Vector3;
    rotation: THREE.Euler;
    gravity: THREE.Vector3;
    velocity: THREE.Vector3;

    body: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
    width: number;
    height: number;
    length: number;

    debug?: boolean;
    directionDebug: DebugVector;
    normalDebug: DebugVector;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, 
        position: THREE.Vector3, direction: THREE.Vector3, 
        rotation: THREE.Euler, debug?: boolean) {

        this.camera = camera;

        this.position = position;
        this.lastCheckpoint = position;
        this.direction = direction;
        this.rotation = rotation;
        this.gravity = defaultGravity;
        this.velocity = new THREE.Vector3(0, 0, 0);
        
        this.width = 1;
        this.height = 1;
        this.length = 1;

        this.debug = debug;
        
        this.render(scene, debug);
    }

    render(scene: THREE.Scene, debug?: boolean) {
        // using cube to simulate vehicle
        let geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.body = new THREE.Mesh(geometry, material);
        this.body.position.set(this.position.x, this.position.y, this.position.z);
        scene.add(this.body);

        if (debug) {
            this.directionDebug = new DebugVector(scene, this.direction, this.position);
            this.normalDebug = new DebugVector(scene, this.direction, this.position);
        }
    }

    handleTrackCollision(track: Track) {  
        let currentPosition = this.body.position.clone();

        // use raycasting to check for collison with track
        for (let i = 0; i < this.body.geometry.attributes.position.count; i++) {
            let localVertex = new THREE.Vector3(
                this.body.geometry.attributes.position.array[i * 3],
                this.body.geometry.attributes.position.array[i * 3 + 1],
                this.body.geometry.attributes.position.array[i * 3 + 2]
            );
            
            let globalVertex = localVertex.applyMatrix4(this.body.matrix);
            let directionVector = globalVertex.sub(this.body.position);

            let ray = new THREE.Raycaster(currentPosition, directionVector.clone().normalize());
            let collisionResults = ray.intersectObjects([track.body]);

            if (collisionResults.length > 0 && 
                collisionResults[0].distance < directionVector.length()) {
                let collision = collisionResults[0].point;
                this.position.y = collision.y + this.height * 0.48;
                
                let surfaceNormal = collisionResults[0].face.normal;
                this.gravity = surfaceNormal.clone().multiplyScalar(-0.003);

                // if normal vector · direction vector is negative,
                // they are facing in opposite directions,
                // so the vehicle is moving up a slope
                let angle = surfaceNormal.clone().angleTo(this.body.up);
                let up = surfaceNormal.clone().dot(this.direction.clone()) < 0;
                this.rotation.x = up ? -angle : angle;

                if (this.debug)
                    this.normalDebug.update(surfaceNormal.clone(), this.position.clone());
                
                return;
            }
        }
    }

    handleVehicleMovement(keysPressed: IControls, dt: number) {
        // acceleration
        if (keysPressed["w"])
            this.velocity.add(this.direction.clone()
                .multiplyScalar(0.001 * dt));

        // deceleration
        if (keysPressed["s"] || keysPressed["shift"])
            this.velocity.sub(this.direction.clone()
                .multiplyScalar(0.0005 * dt));

        // turning
        if (keysPressed["d"]) {
            let angle = -0.0008 * dt;

            // yaw
            this.rotation.y += angle;
            
            // roll
            this.rotation.z = Math.min(this.rotation.z - angle, 0.3);
            
            this.body.setRotationFromEuler(this.rotation);
            this.direction.applyAxisAngle(this.body.up, angle);
        }
        
        if (keysPressed["a"]) {
            let angle = 0.0008 * dt;
            
            this.rotation.y += angle;            
            this.rotation.z = Math.max(this.rotation.z - angle, -0.3);
            
            this.body.setRotationFromEuler(this.rotation);
            this.direction.applyAxisAngle(this.body.up, angle);
        }
        
        // reset roll
        if (!(keysPressed["a"] || keysPressed["d"])) {
            this.rotation.z *= 0.8;            
            this.body.setRotationFromEuler(this.rotation);
        }
        
        // friction
        this.velocity.multiplyScalar(0.98);
        
        // gravity
        this.velocity.add(this.gravity);

        // update position
        this.position.addVectors(this.position, this.velocity);
        this.body.position.set(this.position.x, this.position.y, this.position.z);

        if (this.debug)
            this.directionDebug.update(this.direction.clone(), 
                this.position.clone());
    }

    handleCameraMovement() {
        // set camera behind and above vehicle
        let position = this.body.position.clone()
            .sub(this.direction.clone()
            .multiplyScalar(3));
        position.y = this.body.position.y + 1.5;

        // look forward
        this.camera.position.set(position.x, position.y, position.z);
        this.camera.lookAt(this.body.position.clone().add(this.direction));
    }

    update(keysPressed: IControls, track?: Track, dt?: number) {
        if (track == undefined || dt == undefined)
            return;

        this.rotation.x *= 0.9;
        this.gravity = defaultGravity;

        this.handleTrackCollision(track);
        this.handleVehicleMovement(keysPressed, dt);

        if (!this.manualCamera)
           this.handleCameraMovement();
    }
}