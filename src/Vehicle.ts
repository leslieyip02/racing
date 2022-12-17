import * as THREE from "three";
import GameScene from "./GameScene";
import Track from "./Track";
import { IKeysPressed } from "./utils/interfaces";

export default class Vehicle {
    scene: GameScene;
    camera: THREE.PerspectiveCamera;
    manualCamera: boolean = true;

    position: THREE.Vector3;
    velocity: THREE.Vector3;
    direction: THREE.Vector3;

    body: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
    height: number;
    width: number;
    length: number;

    constructor(scene: GameScene, camera: THREE.PerspectiveCamera, 
        position: THREE.Vector3) {

        this.scene = scene;
        this.camera = camera;

        this.position = position;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.direction = new THREE.Vector3(0, 0, 1);    
    }

    render() {
        let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        let cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.body = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.body.position.set(this.position.x, this.position.y, this.position.z);        
        this.scene.add(this.body);

        this.height = 1;
        this.width = 1;
        this.length = 1;
    }

    handleTrackCollision(track: Track): boolean {        
        let currentPosition = this.body.position.clone();
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

            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                this.position.y = collisionResults[0].point.y + this.height * 0.4;
                return true;
            }
        }

        return false;
    }

    handleVehicleMovement(keysPressed: IKeysPressed, 
        dt: number, isOnTrack: boolean) {
        
        if (keysPressed["w"])
            this.velocity.add(this.direction.clone()
                .multiplyScalar(0.001 * dt));

        if (keysPressed["s"])
            this.velocity.sub(this.direction.clone()
                .multiplyScalar(0.0005 * dt));

        if (keysPressed["d"]) {
            let angle = -0.0008 * dt;
            this.body.rotateY(angle);
            this.direction.applyAxisAngle(this.body.up, angle);
        }
        
        if (keysPressed["a"]) {
            let angle = 0.0008 * dt;
            this.body.rotateY(angle);
            this.direction.applyAxisAngle(this.body.up, angle);
        }
        
        this.velocity.multiplyScalar(0.98);
        this.velocity.y = isOnTrack ? 0 : -0.08;

        this.position.addVectors(this.position, this.velocity);
        this.body.position.set(this.position.x, this.position.y, this.position.z);
    }

    handleCameraMovement() {
        let position = this.body.position.clone()
            .sub(this.direction.clone()
            .multiplyScalar(3));

        position.y = this.body.position.y + 1.5;
        this.camera.position.set(position.x, position.y, position.z);
        this.camera.lookAt(this.body.position.clone().add(this.direction));
    }

    update(keysPressed: IKeysPressed, track: Track, dt?: number) {
        if (track == undefined || dt == undefined)
            return;

        let isOnTrack = this.handleTrackCollision(track);
        this.handleVehicleMovement(keysPressed, dt, isOnTrack);

        if (this.manualCamera)
           this.handleCameraMovement();
    }   
}