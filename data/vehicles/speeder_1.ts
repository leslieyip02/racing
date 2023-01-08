import * as THREE from "three";
import { IVehicleData } from "../../src/utils/interfaces";

let speeder_1: IVehicleData = {
    modelPath: "./assets/models/speeder_1.glb",

    acceleration: 0.00125,
    deceleration: 0.0003,
    friction: 0.98,
    turnRate: 0.0006,
    maxRoll: 0.3,
    defaultGravity: new THREE.Vector3(0, -0.01, 0),

    width: 1,
    height: 2,
    length: 3.4
}

export default speeder_1;