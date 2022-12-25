import * as THREE from "three";
import { ITrackData } from "../../src/utils/interfaces";

let track_s: ITrackData = {
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
                new THREE.Vector3(0, 10, 20),
                new THREE.Vector3(0, 10, 40),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 0
        },
        {
            points: [
                new THREE.Vector3(0, 10, 40),
                new THREE.Vector3(0, 10, 60),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 800
        },
        {
            points: [
                new THREE.Vector3(0, 10, 60),
                new THREE.Vector3(0, 10, 80),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 1600
        },
        {
            points: [
                new THREE.Vector3(0, 10, 80),
                new THREE.Vector3(0, 10, 100),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 2400
        },
        {
            points: [
                new THREE.Vector3(0, 10, 100),
                new THREE.Vector3(0, 10, 120),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 3200
        },
        {
            points: [
                new THREE.Vector3(0, 10, 120),
                new THREE.Vector3(0, 10, 140),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 4000
        },
        {
            points: [
                new THREE.Vector3(0, 10, 140),
                new THREE.Vector3(0, 10, 160),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 4800
        },
        {
            points: [
                new THREE.Vector3(0, 10, 160),
                new THREE.Vector3(0, 10, 180),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 5600
        },
        {
            points: [
                new THREE.Vector3(0, 10, 180),
                new THREE.Vector3(0, 10, 200),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 6400
        },
        {
            points: [
                new THREE.Vector3(0, 10, 200),
                new THREE.Vector3(0, 10, 220),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 7200
        },
        {
            points: [
                new THREE.Vector3(0, 10, 220),
                new THREE.Vector3(0, 10, 240),
            ],
            closed: false,
            extrudeShapeIndex: 0,
            moving: true,
            direction: new THREE.Vector3(10, 0, 0),
            period: 8000,
            phase: 8000
        },
    ],
    extrudeShapes: [
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

export default track_s;