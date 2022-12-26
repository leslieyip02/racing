import * as THREE from "three";
import { ITrackData } from "../../src/utils/interfaces";

let track_0: ITrackData = {
    startPoint: new THREE.Vector3(120, 100, 0),
    startDirection: new THREE.Vector3(0, 0, 1).normalize(),
    startRotation: new THREE.Euler(0, 0, 0, "YZX"),
    curves: [
        {
            points: [
                new THREE.Vector3(120, 90, 0),
                new THREE.Vector3(80, 40, 200),
                new THREE.Vector3(-80, 90, 200),
                new THREE.Vector3(-120, 60, 0),
                new THREE.Vector3(-80, 110, -200),
                new THREE.Vector3(80, 60, -200),
            ],
            closed: true,
            extrudeShapeIndex: 0
        },
    ],
    extrudeShapes: [
        new THREE.Shape([
            new THREE.Vector2(7, 0),
            new THREE.Vector2(-7, 0),
        ])
    ],
    surfaceExtrudeShapes: [
        new THREE.Shape([
            new THREE.Vector2(6, 0.4),
            new THREE.Vector2(-6, 0.4),
        ])
    ],
    outlineExtrudeShapes: [
        new THREE.Shape([
            new THREE.Vector2(7, 0.5),
            new THREE.Vector2(-7, 0.5),
        ])
    ],
    extrudeOptions: {
        steps: 640,
        bevelEnabled: true,
    },
    surfaceMaterial: new THREE.MeshLambertMaterial({ 
        color: 0x000e54,
        wireframe: false
    }),
    outlineMaterial: new THREE.MeshStandardMaterial({ 
        color: 0x99ccff, 
        wireframe: false 
    }),
    backgroundColors: ["#000226", "#000F39", "#002555", "#07205a"],
    gridColor: 0x5badfb
}

export default track_0;