import * as THREE from "three";
import { ITrackData } from "../../../src/utils/interfaces";

let track_8: ITrackData = {
    startPoint: new THREE.Vector3(0, 1, 0),
    startDirection: new THREE.Vector3(1, 0, 1).normalize(),
    startRotation: new THREE.Euler(0, Math.PI / 4, 0, "YZX"),
    curveData: [
        {
            points: [[0, 1, 0], [100, 1, 100], [100, 1, 200], [50, 1, 300], 
                [-50, 1, 300], [-100, 1, 200], [-100, 1, 100], [-75, 1, 75]],
            extrudeShapeIndex: 0
        },
        {
            points: [[-75, 1, 75], [0, 11, 0], [75, 1, -75]],
            extrudeShapeIndex: 0
        },
        {
            points: [[75, 1, -75], [100, 1, -100], [100, 1, -200], [50, 1, -300],
                [-50, 1, -300], [-100, 1, -200], [-100, 1, -100], [0, 1, 0]],
            extrudeShapeIndex: 0
        }
    ],
    layerData: [
        {
            shapes: [[[0, 5], [0, -5]]],
            material: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        },
        {
            shapes: [[[0.4, 5], [0.4, -5]]],
            material: new THREE.MeshLambertMaterial({ color: 0x000e54 })
        },
        {
            shapes: [[[0.5, 5.6], [0.5, -5.6]]],
            material: new THREE.MeshStandardMaterial({ color: 0x99ccff })
        }
    ],
    checkpoints: [],
    backgroundColors: ["#000226", "#000F39", "#002555", "#07205a"],
    gridColor: 0x5badfb
}

export default track_8;