import { IVehicleData } from "../../src/utils/interfaces";

let speeder: IVehicleData = {
    modelPath: "./assets/models/speeder.glb",

    acceleration: 0.00125,
    deceleration: 0.0003,
    friction: 0.98,
    turnRate: 0.0006,
    maxRoll: 0.3,

    width: 1,
    height: 1.2,
    length: 3.4
}

export default speeder;