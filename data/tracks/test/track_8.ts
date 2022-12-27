import * as THREE from "three";
import { ITrackData } from "../../../src/utils/interfaces";

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
            extrudeShapeIndex: 0
        },
        {
            points: [
                new THREE.Vector3(-75, 1, 75),
                new THREE.Vector3(0, 11, 0),
                new THREE.Vector3(75, 1, -75),
            ],
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
            extrudeShapeIndex: 0
        }
    ],
    layers: [
        {
            shapes: [
                new THREE.Shape([
                    new THREE.Vector2(0, 5),
                    new THREE.Vector2(0, -5),
                ])
            ],
            material: new THREE.MeshBasicMaterial({ 
                transparent: true, 
                opacity: 0 
            })
        },
        {
            shapes: [
                new THREE.Shape([
                    new THREE.Vector2(0.4, 5),
                    new THREE.Vector2(0.4, -5),
                ])
            ],
            material: new THREE.MeshLambertMaterial({ 
                color: 0x000e54,
                wireframe: false
            })
        },
        {
            shapes: [
                new THREE.Shape([
                    new THREE.Vector2(0.5, 5.6),
                    new THREE.Vector2(0.5, -5.6),
                ])
            ],
            material: new THREE.MeshStandardMaterial({ 
                color: 0x99ccff, 
                wireframe: false 
            })
        }
    ],
    extrudeOptions: {
        steps: 640,
        bevelEnabled: true,
    },
    backgroundColors: ["#000226", "#000F39", "#002555", "#07205a"],
    gridColor: 0x5badfb
}

export default track_8;