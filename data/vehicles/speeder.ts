import { IVehicleData } from "../../src/utils/interfaces";

let speeder: IVehicleData = {
    modelPath: "./assets/models/speeder.glb",

    acceleration: 0.0015,
    deceleration: 0.0003,
    friction: 0.98,
    turnRate: 0.0006,
    maxRoll: 0.3,

    width: 2,
    height: 1.2,
    length: 2.8
}

export default speeder;