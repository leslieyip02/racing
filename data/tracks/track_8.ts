import * as THREE from "three";
import { ITrackData } from "../../src/utils/interfaces";

let track_8: ITrackData = {
    startPoint: new THREE.Vector3(0, 1, 0),
    startDirection: new THREE.Vector3(1, 0, 1).normalize(),
    startRotation: new THREE.Euler(0, Math.PI / 4, 0, "YZX"),
    curves: [
        {
            points: [
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(100, 1, 100),
                new THREE.Vector3(100, 1, 200),
                new THREE.Vector3(50, 1, 300),
                new THREE.Vector3(-50, 1, 300),
                new THREE.Vector3(-100, 1, 200),
                new THREE.Vector3(-100, 1, 100),
                new THREE.Vector3(-75, 1, 75),
            ],
            closed: false,
            extrudeShapeIndex: 0
        },
        {
            points: [
                new THREE.Vector3(-75, 1, 75),
                new THREE.Vector3(0, 11, 0),
                new THREE.Vector3(75, 1, -75),
            ],
            closed: false,
            extrudeShapeIndex: 0
        },
        {
            points: [
                new THREE.Vector3(75, 1, -75),
                new THREE.Vector3(100, 1, -100),
                new THREE.Vector3(100, 1, -200),
                new THREE.Vector3(50, 1, -300),
                new THREE.Vector3(-50, 1, -300),
                new THREE.Vector3(-100, 1, -200),
                new THREE.Vector3(-100, 1, -100),
                new THREE.Vector3(0, 1, 0),
            ],
            closed: false,
            extrudeShapeIndex: 0
        }
    ],
    extrudeShapes: [
        new THREE.Shape([
            new THREE.Vector2(0, 5),
            new THREE.Vector2(0, -5),
        ]),
        new THREE.Shape([
            new THREE.Vector2(5, 0),
            new THREE.Vector2(-5, 0),
        ])
    ],
    surfaceExtrudeShapes: [
        new THREE.Shape([
            new THREE.Vector2(0.2, 5),
            new THREE.Vector2(0.2, -5),
        ]),
        new THREE.Shape([
            new THREE.Vector2(5, -0.2),
            new THREE.Vector2(-5, -0.2),
        ])
    ],
    outlineExtrudeShapes: [
        new THREE.Shape([
            new THREE.Vector2(0.3, 5.6),
            new THREE.Vector2(0.3, -5.6),
        ]),
        new THREE.Shape([
            new THREE.Vector2(5.6, -0.3),
            new THREE.Vector2(-5.6, -0.3),
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
    gridColor: 0x5badfb
}

export default track_8;