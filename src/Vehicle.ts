import * as THREE from "three";
import GameScene from "./GameScene";
import Track from "./Track";
import { IKeysPressed } from "./utils/interfaces";

export default class Vehicle {
    scene: GameScene;
    camera: THREE.PerspectiveCamera;
    manualCamera: boolean = false;

    position: THREE.Vector3;
    lastCheckpoint: THREE.Vector3;
    velocity: THREE.Vector3;
    direction: THREE.Vector3;
    rotation: THREE.Euler;

    body: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
    height: number;
    width: number;
    length: number;

    directionHelper: THREE.ArrowHelper;
    normalHelper: THREE.ArrowHelper;

    constructor(scene: GameScene, camera: THREE.PerspectiveCamera, 
        position: THREE.Vector3) {

        this.scene = scene;
        this.camera = camera;

        this.position = position;
        this.lastCheckpoint = position;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.direction = new THREE.Vector3(0, 0, 1);
        this.rotation = new THREE.Euler(0, 0, 0);
        
        this.height = 1;
        this.width = 1;
        this.length = 1;
    }

    render() {
        // using cube to simulate vehicle
        let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        let cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.body = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.body.position.set(this.position.x, this.position.y, this.position.z);        
        this.scene.add(this.body);

        this.directionHelper = new THREE.ArrowHelper(this.direction.clone(), this.position.clone(), 3, 0xff0000);
        this.normalHelper = new THREE.ArrowHelper(this.direction.clone(), this.position.clone(), 3, 0xff0000);
        this.scene.add(this.directionHelper);
        this.scene.add(this.normalHelper);
    }

    handleTrackCollision(track: Track): boolean {        
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

            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                let collision = collisionResults[0].point;
                let surfaceNormal = collisionResults[0].face.normal;

                this.normalHelper.setDirection(surfaceNormal);
                this.normalHelper.position.set(this.position.x, this.position.y, this.position.z);
                
                this.position.y = collision.y + this.height * 0.48;
                return true;
            }
        }

        return false;
    }

    handleVehicleMovement(keysPressed: IKeysPressed, 
        dt: number, isOnTrack: boolean) {

        // acceleration
        if (keysPressed["w"])
            this.velocity.add(this.direction.clone()
                .multiplyScalar(0.001 * dt));

        // deceleration
        if (keysPressed["s"])
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
        
        // apply gravity
        this.velocity.y = isOnTrack ? 0 : -0.08;

        // update position
        this.position.addVectors(this.position, this.velocity);
        this.body.position.set(this.position.x, this.position.y, this.position.z);
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

    update(keysPressed: IKeysPressed, track: Track, dt?: number) {
        if (track == undefined || dt == undefined)
            return;

        let isOnTrack = this.handleTrackCollision(track);
        this.handleVehicleMovement(keysPressed, dt, isOnTrack);

        if (!this.manualCamera)
           this.handleCameraMovement();

        this.directionHelper.setDirection(this.direction.clone())
        this.directionHelper.position.set(this.position.x, this.position.y, this.position.z);

        if (this.position.y < -8) {
            this.position = this.lastCheckpoint.clone();
            this.body.position.set(this.position.x, this.position.y, this.position.z);
        }
    }
}