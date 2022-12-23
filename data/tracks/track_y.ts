import * as THREE from "three";
import { ITrackData } from "../../src/utils/interfaces";

let track_y: ITrackData = {
    startPoint: new THREE.Vector3(0, 10, 0),
    startDirection: new THREE.Vector3(0, 0, 1).normalize(),
    startRotation: new THREE.Euler(0, 0, 0, "YZX"),
    curves: [
        {
            points: [
                new THREE.Vector3(0, 10, -20),
                new THREE.Vector3(0, 10, 20),
            ],
            closed: false,
            extrudeShapeIndex: 0
        },
        {
            points: [
                new THREE.Vector3(-5, 10, 20),
                new THREE.Vector3(-5, 10, 30),
                new THREE.Vector3(-20, 10, 40),
                new THREE.Vector3(-20, 10, 50),
            ],
            closed: false,
            extrudeShapeIndex: 1
        },
        {
            points: [
                new THREE.Vector3(5, 10, 20),
                new THREE.Vector3(5, 10, 30),
                new THREE.Vector3(20, 10, 40),
                new THREE.Vector3(20, 10, 50),
            ],
            closed: false,
            extrudeShapeIndex: 1
        },
        {
            points: [
                new THREE.Vector3(-20, 10, 50),
                new THREE.Vector3(-20, 10, 60),
                new THREE.Vector3(-20, 15, 80),
                new THREE.Vector3(-20, 10, 100),
                new THREE.Vector3(-20, 10, 110),
            ],
            closed: false,
            extrudeShapeIndex: 2
        },
        {
            points: [
                new THREE.Vector3(20, 10, 50),
                new THREE.Vector3(20, 10, 60),
                new THREE.Vector3(20, 5, 80),
                new THREE.Vector3(20, 10, 100),
                new THREE.Vector3(20, 10, 110),
            ],
            closed: false,
            extrudeShapeIndex: 2
        },
    ],
    extrudeShapes: [
        new THREE.Shape([
            new THREE.Vector2(0, 10),
            new THREE.Vector2(0, -10),
        ]),
        new THREE.Shape([
            new THREE.Vector2(0, 5),
            new THREE.Vector2(0, -5),
        ]),
        new THREE.Shape([
            new THREE.Vector2(5, 0),
            new THREE.Vector2(-5, 0),
        ]),
    ],
    surfaceExtrudeShapes: [
        new THREE.Shape([
            new THREE.Vector2(0.4, 9),
            new THREE.Vector2(0.4, -9),
        ]),
        new THREE.Shape([
            new THREE.Vector2(0.4, 4),
            new THREE.Vector2(0.4, -4),
        ]),
        new THREE.Shape([
            new THREE.Vector2(4, 0.4),
            new THREE.Vector2(-4, 0.4),
        ]),
    ],
    outlineExtrudeShapes: [
        new THREE.Shape([
            new THREE.Vector2(0.5, 10),
            new THREE.Vector2(0.5, -10),
        ]),
        new THREE.Shape([
            new THREE.Vector2(0.5, 5),
            new THREE.Vector2(0.5, -5),
        ]),
        new THREE.Shape([
            new THREE.Vector2(5, 0.5),
            new THREE.Vector2(-5, 0.5),
        ]),
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

export default track_y;