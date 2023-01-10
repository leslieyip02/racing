import * as THREE from "three";
import { CurveData, TrackData } from "../../../src/utils/interfaces";

let track_s: TrackData = {
    startPoint: new THREE.Vector3(0, 10, 0),
    startDirection: new THREE.Vector3(0, 0, 1).normalize(),
    startRotation: new THREE.Euler(0, 0, 0, "YZX"),
    curveData: [
        {
            points: [[0, 10, -20], [0, 10, 20]],
            extrudeShapeIndex: 0
        },
        ... Array(10).fill(0).map((_, i): CurveData => {
            return {
                points: [[0, 10, (i + 1) * 20], [0, 10, (i + 2) * 20]],
                extrudeShapeIndex: 0,
                moving: true,
                direction: new THREE.Vector3(10, 0, 0),
                period: 8000,
                phase: i * 800
            }
        })
    ],
    layerData: [
        {
            shapes: [[[0, 5], [0, -5]]],
            material: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        },
        {
            shapes: [[[0.4, 4], [0.4, -4]]],
            material: new THREE.MeshLambertMaterial({ color: 0x000e54 })
        },
        {
            shapes: [[[0.5, 5], [0.5, -5]]],
            material: new THREE.MeshLambertMaterial({ color: 0x99ccff })
        }
    ],
    checkpoints: [],
    backgroundColors: ["#000226", "#000F39", "#002555", "#07205a"],
    gridColor: 0x5badfb
}

export default track_s;