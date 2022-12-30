import * as THREE from "three";
import { ITrackData } from "../../../src/utils/interfaces";

let track_o: ITrackData = {
    startPoint: new THREE.Vector3(20, 1, 0),
    startDirection: new THREE.Vector3(0, 0, 1).normalize(),
    startRotation: new THREE.Euler(0, 0, 0, "YZX"),
    curves: [
        {
            points: [[0, 1, 0]],
            extrudeShapeIndex: 0,
            ellipse: true,
            xRadius: 20,
            yRadius: 20,
            startAngle: 0,
            endAngle: 2 * Math.PI
        },
    ],
    layers: [
        {
            shapes: [[[0, 7], [0, -7]]],
            material: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        },
        {
            shapes: [[[0.4, 6], [0.4, -6]]],
            material: new THREE.MeshLambertMaterial({ color: 0x000e54 })
        },
        {
            shapes: [[[0.5, 7], [0.5, -7]]],
            material: new THREE.MeshStandardMaterial({ color: 0x99ccff })
        }
    ],
    backgroundColors: ["#000226", "#000F39", "#002555", "#07205a"],
    gridColor: 0x5badfb
}

export default track_o;