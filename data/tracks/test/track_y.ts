import * as THREE from "three";
import { ITrackData } from "../../../src/utils/interfaces";

let track_y: ITrackData = {
    startPoint: new THREE.Vector3(0, 10, 0),
    startDirection: new THREE.Vector3(0, 0, 1).normalize(),
    startRotation: new THREE.Euler(0, 0, 0, "YZX"),
    curves: [
        {
            points: [[0, 10, -20], [0, 10, 20]],
            extrudeShapeIndex: 0
        },
        {
            points: [[-5, 10, 20], [-5, 10, 30], [-20, 10, 40], [-20, 10, 50]],
            extrudeShapeIndex: 1
        },
        {
            points: [[5, 10, 20], [5, 10, 30], [20, 10, 40], [20, 10, 50]],
            extrudeShapeIndex: 1
        },
        {
            points: [[-20, 10, 50], [-20, 10, 60],
                [-20, 15, 80], [-20, 10, 100], [-20, 10, 110]],
            extrudeShapeIndex: 2
        },
        {
            points: [[20, 10, 50],[20, 10, 60],
                [20, 5, 80], [20, 10, 100], [20, 10, 110]],
            extrudeShapeIndex: 2
        },
    ],
    layers: [
        {
            shapes: [[[0, 10], [0, -10]], [[0, 5], [0, -5]], [[5, 0], [-5, 0]]],
            material: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        },
        {
            shapes: [[[0.4, 9], [0.4, -9]], [[0.4, 4], [0.4, -4]], [[4, 0.4], [-4, 0.4]]],
            material: new THREE.MeshLambertMaterial({ color: 0x000e54 })
        },
        {
            shapes: [[[0.5, 10], [0.5, -10]], [[0.5, 5], [0.5, -5]], [[5, 0.5], [-5, 0.5]]],
            material: new THREE.MeshStandardMaterial({ color: 0x99ccff })
        }
    ],
    backgroundColors: ["#000226", "#000F39", "#002555", "#07205a"],
    gridColor: 0x5badfb
}

export default track_y;