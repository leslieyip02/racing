import { VehicleData } from "../../src/utils/interfaces";

let bike: VehicleData = {
    modelPath: "./assets/models/bike.glb",

    acceleration: 0.001,
    deceleration: 0.0005,
    friction: 0.98,
    turnRate: 0.0008,
    maxRoll: 0.36,

    width: 1,
    height: 1.2,
    length: 2.5
}

export default bike;