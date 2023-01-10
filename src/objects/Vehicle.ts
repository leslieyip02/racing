import * as THREE from "three";
import Track from "./Track";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DynamicDebugVector } from "../utils/debug";
import { Checkpoint, VehicleData } from "../utils/interfaces";

export default class Vehicle {
    acceleration: number;
    deceleration: number;
    friction: number;
    turnRate: number;
    maxRoll: number;
    defaultGravity: THREE.Vector3;
    
    position: THREE.Vector3;
    direction: THREE.Vector3;
    rotation: THREE.Euler;
    gravity: THREE.Vector3;
    velocity: THREE.Vector3;
    thrust: number;

    width: number;
    height: number;
    length: number;

    model: THREE.Group;
    hitbox: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;

    isAlive: boolean;
    canMove: boolean;

    checkpoint: Checkpoint;
    lastCheckpointIndex: number;
    laps: number;

    directionDebug?: DynamicDebugVector;
    normalDebug?: DynamicDebugVector;
    upDebug?: DynamicDebugVector;

    constructor(scene: THREE.Scene, vehicleData: VehicleData, 
        position: THREE.Vector3, direction: THREE.Vector3,
        rotation: THREE.Euler, debug?: boolean) {

        this.acceleration = vehicleData.acceleration;
        this.deceleration = vehicleData.deceleration;
        this.friction = vehicleData.friction;
        this.turnRate = vehicleData.turnRate;
        this.maxRoll = vehicleData.maxRoll;
        this.defaultGravity = vehicleData.defaultGravity || 
            new THREE.Vector3(0, -0.012, 0);

        this.position = position;
        this.direction = direction;
        this.rotation = rotation;
        this.gravity = this.defaultGravity;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.thrust = 0;

        this.width = vehicleData.width;
        this.height = vehicleData.height;
        this.length = vehicleData.length;

        this.render(scene, vehicleData.modelPath, debug);

        this.isAlive = true;
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
            this.directionDebug = new DynamicDebugVector(scene, this.direction, this.position);
            this.normalDebug = new DynamicDebugVector(scene, this.direction, this.position);
            this.upDebug = new DynamicDebugVector(scene, this.direction, this.position, 3, 0x00ff00);
        }
    }

    handleTrackCollision(track: Track, updateUI?: boolean) {
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

                                if (updateUI)
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

    turn(angle: number) {
        // yaw
        this.rotation.y += angle;
        
        // roll
        let roll = this.rotation.z - angle;
        this.rotation.z = angle < 0 ? Math.min(roll, this.maxRoll) :
            Math.max(roll, -this.maxRoll);

        this.direction.applyAxisAngle(this.hitbox.up, angle);
    }

    handleVehicleMovement() {
        if (!this.canMove)
            return;

        // friction
        this.velocity.multiplyScalar(this.friction);

        // gravity
        this.velocity.add(this.gravity);

        // position
        this.position.add(this.velocity);
        this.model.position.set(this.position.x, this.position.y, this.position.z);
        this.hitbox.position.set(this.position.x, this.position.y, this.position.z);

        // rotation
        this.model.setRotationFromEuler(this.rotation.clone());
        this.hitbox.setRotationFromEuler(this.rotation.clone());

        if (this.directionDebug)
            this.directionDebug.update(this.direction.clone(), this.position.clone());

        if (this.upDebug)
            this.upDebug.update(this.hitbox.up, this.position.clone());
    }

    handleOutOfBounds(updateUI?: boolean) {
        // reset vehicle to last checkpoint if it falls out of bounds        
        if (this.position.y < -30 || !this.isAlive) {            
            let curtain = document.getElementById("curtain");
            if (updateUI)
                curtain.classList.add("fade-to-black");

            if (this.isAlive) {
                this.isAlive = false;

                setTimeout(() => {
                    this.resetToCheckpoint(this.checkpoint);
                    this.isAlive = true;
                    this.canMove = false;

                    if (updateUI) {
                        curtain.classList.remove("fade-to-black");
                        curtain.style.opacity = "100";
                        curtain.classList.add("scroll-up");
                    }
                    
                    setTimeout(() => {
                        if (updateUI) {
                            curtain.classList.remove("scroll-up");
                            curtain.style.opacity = "0";
                        }

                        this.canMove = true;
                    }, 1000)
                }, 900);
            } 
        }
    }

    resetToCheckpoint(checkpoint: Checkpoint) {
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
        this.thrust = 0;
        this.model.position.set(this.position.x, this.position.y, this.position.z);
        this.hitbox.position.set(this.position.x, this.position.y, this.position.z);
        this.model.setRotationFromEuler(this.rotation.clone());
        this.hitbox.setRotationFromEuler(this.rotation.clone());
    }

    update(track: Track,  dt?: number) {
        if (!this.model || !this.hitbox || !track || !dt)
            return;
    
        this.gravity = this.defaultGravity;
        this.handleTrackCollision(track);        
        this.handleVehicleMovement();
        this.handleOutOfBounds();
    }
}