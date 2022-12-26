import * as THREE from "three";
import Track from "./Track";
import { IControls, IVehicleData } from "../utils/interfaces";
import { DebugVector } from "../utils/debug";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
    
    acceleration: number;
    deceleration: number;
    friction: number;
    turnRate: number;
    maxRoll: number;
    
    width: number;
    height: number;
    length: number;
    
    model: THREE.Group;
    hitbox: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;

    directionDebug?: DebugVector;
    normalDebug?: DebugVector;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, 
        vehicleData: IVehicleData, position: THREE.Vector3, 
        direction: THREE.Vector3, rotation: THREE.Euler, debug?: boolean) {

        this.camera = camera;

        this.position = position;
        this.lastCheckpoint = position;
        this.direction = direction;
        this.rotation = rotation;
        this.gravity = defaultGravity;
        this.velocity = new THREE.Vector3(0, 0, 0);
        
        this.acceleration = vehicleData.acceleration;
        this.deceleration = vehicleData.deceleration;
        this.friction = vehicleData.friction;
        this.turnRate = vehicleData.turnRate;
        this.maxRoll = vehicleData.maxRoll;

        this.width = vehicleData.width;
        this.height = vehicleData.height;
        this.length = vehicleData.length;
        
        this.render(scene, vehicleData.modelPath, debug);
    }

    loadGLTF(scene: THREE.Scene, data: GLTF) {
        this.model = data.scene;
        this.model.position.set(this.position.x, this.position.y, this.position.z);

        // check for and enable transparent materials
        for (let mesh of this.model.children) {
            // the model itself is a THREE.Group
            if (mesh.name == "body") {

                // the model contains an array of THREE.Mesh,
                // but the compiler thinks it's an array of
                // THREE.Object3d<THREE.Event>, 
                // so the type errors have been silenced
                for (let material of mesh.children) {
                    // @ts-ignore
                    if (material.material.name == "transparent") {
                        // @ts-ignore
                        material.material.transparent = true;
                        // @ts-ignore
                        material.material.opacity = 0.2;
                    }
                }
            }
        }

        scene.add(this.model);
    }

    async render(scene: THREE.Scene, modelPath: string, debug?: boolean) {        
        // async render model
        let loader = new GLTFLoader();
        await loader.loadAsync(modelPath)
            .then(data => this.loadGLTF(scene, data));     
        
        // vehicle hitbox
        let geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
        let material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, 
            wireframe: true, 
            transparent: !debug,
            opacity: 0
        });

        this.hitbox = new THREE.Mesh(geometry, material);
        this.hitbox.position.set(this.position.x, this.position.y, this.position.z);
        scene.add(this.hitbox);

        if (debug) {
            this.directionDebug = new DebugVector(scene, this.direction, this.position);
            this.normalDebug = new DebugVector(scene, this.direction, this.position);
        }
    }

    handleTrackCollision(track: Track) {
        let currentPosition = this.position.clone();

        // use raycasting to check for collison with track
        for (let i = 0; i < this.hitbox.geometry.attributes.position.count; i++) {
            let localVertex = new THREE.Vector3(
                this.hitbox.geometry.attributes.position.array[i * 3],
                this.hitbox.geometry.attributes.position.array[i * 3 + 1],
                this.hitbox.geometry.attributes.position.array[i * 3 + 2]
            );
            
            let globalVertex = localVertex.applyMatrix4(this.hitbox.matrix);
            let directionVector = globalVertex.sub(this.hitbox.position);

            let ray = new THREE.Raycaster(currentPosition, directionVector.clone().normalize());
            
            let trackMeshes = [track.body];
            for (let platform of track.movingPlatforms)
                trackMeshes.push(platform.mesh);
    
            let collisionResults = ray.intersectObjects(trackMeshes);
            if (collisionResults.length > 0 && 
                collisionResults[0].distance < directionVector.length()) {
                let collision = collisionResults[0].point;
                this.position.y = collision.y;
                
                let surfaceNormal = collisionResults[0].face.normal;
                this.gravity = surfaceNormal.clone().multiplyScalar(-0.003);

                // stop model from flipping when it clips below the track 
                // and surfaceNormal points downwards
                if (surfaceNormal.y >= 0) {
                    // if normal vector · direction vector is negative,
                    // they are facing in opposite directions,
                    // so the vehicle is moving up a slope
                    let angle = surfaceNormal.clone().angleTo(this.hitbox.up);
                    let up = surfaceNormal.clone().dot(this.direction.clone()) < 0;
    
                    if (up)
                        angle = 2 * Math.PI - angle;
    
                    this.rotation.x = angle;
                }


                if (this.normalDebug)
                    this.normalDebug.update(surfaceNormal.clone(), this.position.clone());
                
                return;
            }
        }
    }

    handleVehicleMovement(keysPressed: IControls, dt: number) {
        // acceleration
        if (keysPressed["w"])
            this.velocity.add(this.direction.clone()
                .multiplyScalar(this.acceleration * dt));

        // deceleration
        if (keysPressed["s"] || keysPressed["shift"])
            this.velocity.sub(this.direction.clone()
                .multiplyScalar(this.deceleration * dt));

        // turning
        if (keysPressed["d"]) {
            let angle = -this.turnRate * dt;

            // yaw
            this.rotation.y += angle;
            
            // roll
            this.rotation.z = Math.min(this.rotation.z - angle, this.maxRoll);
            
            this.model.setRotationFromEuler(this.rotation.clone());

            // collision hitbox does not need to roll
            let hitboxRotation = this.rotation.clone();
            hitboxRotation.z = 0;
            this.hitbox.setRotationFromEuler(hitboxRotation);
            
            this.direction.applyAxisAngle(this.hitbox.up, angle);
        }
        
        if (keysPressed["a"]) {
            let angle = this.turnRate * dt;
            
            this.rotation.y += angle;            
            this.rotation.z = Math.max(this.rotation.z - angle, -this.maxRoll);
            
            this.model.setRotationFromEuler(this.rotation.clone());
            
            let hitboxRotation = this.rotation.clone();
            hitboxRotation.z = 0;
            this.hitbox.setRotationFromEuler(hitboxRotation);

            this.direction.applyAxisAngle(this.hitbox.up, angle);
        }
        
        // reset roll
        if (!(keysPressed["a"] || keysPressed["d"])) {
            this.rotation.z *= 0.8;            
            this.model.setRotationFromEuler(this.rotation.clone());
            this.hitbox.setRotationFromEuler(this.rotation.clone());
        }
        
        // friction
        this.velocity.multiplyScalar(this.friction);
        
        // gravity
        this.velocity.add(this.gravity);

        // update position
        this.position.add(this.velocity);
        this.model.position.set(this.position.x, this.position.y, this.position.z);
        this.hitbox.position.set(this.position.x, this.position.y, this.position.z);

        if (this.directionDebug)
            this.directionDebug.update(this.direction.clone(), this.position.clone());
    }

    handleCameraMovement(forward: boolean) {
        let cameraPosition = this.position.clone();
        let lookAtPosition = this.position.clone();
        let offset = this.direction.clone().multiplyScalar(3);
        
        if (forward) {
            // set camera behind and above vehicle
            cameraPosition.sub(offset);            
            lookAtPosition.add(this.direction);
        } else {
            cameraPosition.add(offset);
            lookAtPosition.sub(this.direction);
        }

        cameraPosition.y = cameraPosition.y + 1.5;
        this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        this.camera.lookAt(lookAtPosition);
    }

    update(keysPressed: IControls, track?: Track, dt?: number) {
        if (!this.model || !this.hitbox || !track || !dt)
            return;

        this.gravity = defaultGravity;

        this.handleTrackCollision(track);
        this.handleVehicleMovement(keysPressed, dt);

        if (!this.manualCamera) {
            let forward = !keysPressed["r"];
            this.handleCameraMovement(forward);
        }
    }
}