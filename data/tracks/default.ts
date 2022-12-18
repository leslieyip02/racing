import * as THREE from "three";
import { ITrackData } from "../../src/utils/interfaces";

let defaultTrack: ITrackData = {
    startPoint: new THREE.Vector3(0, 0, 0),
    curves: [
        {
            points: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(100, 0, 100),
                new THREE.Vector3(100, 0, 200),
                new THREE.Vector3(50, 0, 300),
                new THREE.Vector3(-50, 0, 300),
                new THREE.Vector3(-100, 0, 200),
                new THREE.Vector3(-100, 0, 100),
                new THREE.Vector3(-75, 0, 75),
            ],
            extrudeShapeIndex: 0
        },
        {
            points: [
                new THREE.Vector3(75, 0, -75),
                new THREE.Vector3(100, 0, -100),
                new THREE.Vector3(100, 0, -200),
                new THREE.Vector3(50, 0, -300),
                new THREE.Vector3(-50, 0, -300),
                new THREE.Vector3(-100, 0, -200),
                new THREE.Vector3(-100, 0, -100),
                new THREE.Vector3(0, 0, 0),
            ],
            extrudeShapeIndex: 0
        },
        {
            points: [
                new THREE.Vector3(-75, 0, 75),
                new THREE.Vector3(0, 10, 0),
                new THREE.Vector3(75, 0, -75),
            ],
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
    outlineExtrudeShapes: [
        new THREE.Shape([
            new THREE.Vector2(0.1, 5.6),
            new THREE.Vector2(0.1, -5.6),
        ]),
        new THREE.Shape([
            new THREE.Vector2(5.6, -0.1),
            new THREE.Vector2(-5.6, -0.1),
        ])
    ],
    extrudeOptions: {
        steps: 640,
        bevelEnabled: true,
    },
    material: new THREE.MeshLambertMaterial({ 
        color: 0x000e54,
        wireframe: false
    }),
    outlineMaterial: new THREE.MeshStandardMaterial({ 
        color: 0x99ccff, 
        wireframe: false 
    })
}

export default defaultTrack;