import * as THREE from "three";
import Track from "./Track";
import { IControls, ICheckpoint, IVehicleData } from "../utils/interfaces";
import { DebugVector } from "../utils/debug";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let defaultGravity = new THREE.Vector3(0, -0.012, 0);

export default class Vehicle {
    camera: THREE.PerspectiveCamera;
    manualCamera: boolean = false;

    position: THREE.Vector3;
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

    alive: boolean;
    canMove: boolean;

    checkpoint: ICheckpoint;
    lastCheckpointIndex: number;
    laps: number;

    directionDebug?: DebugVector;
    normalDebug?: DebugVector;
    upDebug?: DebugVector;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera,
        vehicleData: IVehicleData, position: THREE.Vector3, direction: THREE.Vector3,
        rotation: THREE.Euler, debug?: boolean) {

        this.camera = camera;

        this.position = position;
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

        this.alive = true;
        this.canMove = true;

        this.lastCheckpointIndex = 1;
        this.laps = 1;
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
            this.upDebug = new DebugVector(scene, this.direction, this.position, 3, 0x00ff00);
        }
    }

    handleTrackCollision(track: Track) {
        let currentPosition = this.position.clone();

        let handledCollision = false;
        let handledCheckpoint = false;

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

                // stop model from clipping through
                this.gravity = new THREE.Vector3(0, 0, 0);

                let collision = collisionResults[0].point;
                if (this.position.y < collision.y)
                    this.position.y = collision.y;
                    
                let surfaceNormal = collisionResults[0].face.normal.clone();
                if (this.normalDebug)
                    this.normalDebug.update(surfaceNormal.clone(), this.position.clone());

                // ensure surfaceNormal always points upwards
                // to prevent flipping
                if (surfaceNormal.y < 0) 
                    surfaceNormal.negate();

                // get component of surface normal along the vehicle's direction
                let planeNormal = this.hitbox.up.clone().cross(this.direction.clone());
                let normalAlongDirection = surfaceNormal.clone().projectOnPlane(planeNormal);
                let angle = normalAlongDirection.angleTo(this.hitbox.up)

                // set the direction to be along the track
                this.direction = normalAlongDirection.cross(planeNormal)
                    .negate().normalize();

                // rotate in other direction if vehicle going up slope
                if (this.direction.y >= 0)
                    angle *= -1;

                // pitch
                this.rotation.x = angle;

                handledCollision = true;
            }

            // use raycasting to handle collision with checkpoint planes too
            if (!handledCheckpoint) {
                for (let checkpoint of track.checkpoints) {
                    let checkpointResult = ray.intersectObject(checkpoint.mesh);

                    if (checkpointResult.length > 0 &&
                        checkpointResult[0].distance < directionVector.length()) {

                        // if the last checkpoint index is less than the current,
                        // update the last checkpoint to the current
                        // take the modulus of the index so that the last checkpoint's
                        // value is less than the first checkpoint
                        // this allows checkpoints to be skipped in order to enable shortcuts
                        if (checkpoint.index > (this.lastCheckpointIndex % track.checkpoints.length)) {
                            if (checkpoint.index == 1) {
                                this.laps++;
                                document.getElementById("counter").innerHTML = 
                                    `Lap ${this.laps.toString()}/3`;
                            }
                            
                            this.lastCheckpointIndex = checkpoint.index;
                            this.checkpoint = checkpoint;
                        }

                        handledCheckpoint = true;
                        break;
                    }
                }
            }

            if (handledCollision && handledCheckpoint)
                return;
        }

        // if the vehicle is airborne, rotate it back to be
        // perpendicular to the y axis
        if (!handledCollision) 
            this.rotation.x *= 0.99;
    }

    handleVehicleMovement(keysPressed: IControls, dt: number) {
        if (!this.canMove)
            return;

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

        if (this.upDebug)
            this.upDebug.update(this.hitbox.up, this.position.clone());
    }

    handleCameraMovement(forward: boolean, follow: boolean = true) {
        let lookAtPosition = this.position.clone();

        // the camera will only follow the vehicle if it is in bounds
        if (follow) {
            let cameraPosition = this.position.clone();
            let facingDirection = new THREE.Vector3(this.direction.x, 
                0, this.direction.z).normalize();

            if (!forward)
                facingDirection.negate();

            // set the camera to look further in front of the vehicle 
            lookAtPosition.add(facingDirection);

            // set camera behind and above vehicle
            let positionOffset = facingDirection.clone().multiplyScalar(3);
            cameraPosition.sub(positionOffset);
            cameraPosition.y += 1.5;
            this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        }

        this.camera.lookAt(lookAtPosition);
    }

    resetToCheckpoint(checkpoint: ICheckpoint) {
        // default checkpoint values
        if (!checkpoint) {
            this.position = new THREE.Vector3(0, 0, 0);
            this.direction = new THREE.Vector3(1, 0, 0);
            this.rotation = new THREE.Euler(0, Math.PI / 2, 0, "YZX");
        } else {
            this.position = checkpoint.mesh.position.clone();
            this.direction = checkpoint.resetDirection.clone();
            this.rotation = checkpoint.resetRotation.clone();
        }
        
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.model.position.set(this.position.x, this.position.y, this.position.z);
        this.hitbox.position.set(this.position.x, this.position.y, this.position.z);
        this.model.setRotationFromEuler(this.rotation.clone());
        this.hitbox.setRotationFromEuler(this.rotation.clone());
    }

    update(keysPressed: IControls, track?: Track, dt?: number) {
        if (!this.model || !this.hitbox || !track || !dt)
            return;
    
        this.gravity = defaultGravity;
        this.handleTrackCollision(track);        
        this.handleVehicleMovement(keysPressed, dt);

        // reset vehicle to last checkpoint if it falls out of bounds        
        if (this.position.y < -30 || !this.alive) {
            let curtain = document.getElementById("curtain");
            curtain.classList.add("fade-to-black");

            if (this.alive) {
                this.alive = false;

                setTimeout(() => {
                    this.resetToCheckpoint(this.checkpoint);
                    this.alive = true;
                    this.canMove = false;

                    curtain.classList.remove("fade-to-black");
                    curtain.style.opacity = "100";
                    curtain.classList.add("scroll-up");
                    
                    setTimeout(() => {
                        curtain.classList.remove("scroll-up");
                        curtain.style.opacity = "0";
                        this.canMove = true;
                    }, 1000)
                }, 900);
            } 
        }
        
        if (!this.manualCamera) {
            let forward = !keysPressed["r"];
            this.handleCameraMovement(forward, this.alive);
        }
    }
}