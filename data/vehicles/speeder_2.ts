import * as THREE from "three";
import { VehicleData } from "../../src/utils/interfaces";

let speeder_2: VehicleData = {
    modelPath: "./assets/models/speeder_2.glb",

    acceleration: 0.0012,
    deceleration: 0.0006,
    friction: 0.98,
    turnRate: 0.0007,
    maxRoll: 0.4,
    defaultGravity: new THREE.Vector3(0, -0.01, 0),

    width: 1.2,
    height: 2,
    length: 3
}

export default speeder_2;