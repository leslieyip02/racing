import * as THREE from "three";
import { ITrackData } from "../../../src/utils/interfaces";

let track_0: ITrackData = {
    startPoint: new THREE.Vector3(120, 100, 0),
    startDirection: new THREE.Vector3(0, 0, 1).normalize(),
    startRotation: new THREE.Euler(0, 0, 0, "YZX"),
    curveData: [
        {
            points: [[120, 90, 0], [80, 40, 200], [-80, 90, 200], 
                [-120, 60, 0], [-80, 110, -200], [80, 60, -200]],
            closed: true,
            extrudeShapeIndex: 0
        },
    ],
    layerData: [
        {
            shapes: [[[7, 0], [-7, 0]]],
            material: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        },
        {
            shapes: [[[6, 0.4], [-6, 0.4]]],
            material: new THREE.MeshLambertMaterial({ color: 0x000e54 })
        },
        {
            shapes: [[[7, 0.5], [-7, 0.5]]],
            material: new THREE.MeshStandardMaterial({ color: 0x99ccff })
        }
    ],
    checkpoints: [],
    backgroundColors: ["#000226", "#000F39", "#002555", "#07205a"],
    gridColor: 0x5badfb
}

export default track_0;