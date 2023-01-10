import * as THREE from "three";
import { VehicleData } from "../../src/utils/interfaces";

let speeder_3: VehicleData = {
    modelPath: "./assets/models/speeder_3.glb",

    acceleration: 0.0013,
    deceleration: 0.0010,
    friction: 0.98,
    turnRate: 0.0007,
    maxRoll: 0.3,
    defaultGravity: new THREE.Vector3(0, -0.01, 0),

    width: 1.4,
    height: 2,
    length: 3.2
}

export default speeder_3;