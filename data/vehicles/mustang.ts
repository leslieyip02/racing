import { IVehicleData } from "../../src/utils/interfaces";

let mustang: IVehicleData = {
    modelPath: "./assets/models/mustang.glb",

    acceleration: 0.0012,
    deceleration: 0.0004,
    friction: 0.98,
    turnRate: 0.0008,
    maxRoll: 0.5,

    width: 2,
    height: 1.2,
    length: 2.8
}

export default mustang;