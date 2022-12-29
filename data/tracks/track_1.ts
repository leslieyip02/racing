import * as THREE from "three";
import { ITrackData } from "../../src/utils/interfaces";

let track_1: ITrackData = {
    startPoint: new THREE.Vector3(0, 0, 0),
    startDirection: new THREE.Vector3(1, 0, 0).normalize(),
    startRotation: new THREE.Euler(0, Math.PI / 2, 0, "YZX"),
    curves: [
        {
            points: [
                new THREE.Vector3(-50, 0, 0),
                new THREE.Vector3(150, 0, 0),
            ],
            extrudeShapeIndex: 2
        },
        {
            points: [
                new THREE.Vector3(150, 0, 8),
                new THREE.Vector3(200, 0, 8),
                new THREE.Vector3(250, -10, 8),
                new THREE.Vector3(300, 0, 8),
                new THREE.Vector3(350, 10, 8),
                new THREE.Vector3(400, 0, 8),
                new THREE.Vector3(450, -10, 8),
                new THREE.Vector3(500, 0, 8),
                new THREE.Vector3(550, 0, 8),
            ],
            extrudeShapeIndex: 3
        },
        {
            points: [
                new THREE.Vector3(150, 0, -8),
                new THREE.Vector3(200, 0, -8),
                new THREE.Vector3(250, 10, -8),
                new THREE.Vector3(300, 0, -8),
                new THREE.Vector3(350, -10, -8),
                new THREE.Vector3(400, 0, -8),
                new THREE.Vector3(450, 10, -8),
                new THREE.Vector3(500, 0, -8),
                new THREE.Vector3(550, 0, -8),
            ],
            extrudeShapeIndex: 3
        },
        {
            points: [
                new THREE.Vector3(550, 0, 0),
                new THREE.Vector3(600, 0, 0),
                new THREE.Vector3(650, 4, 0),
                new THREE.Vector3(675, 8, 50),
                new THREE.Vector3(675, 8, 100),
                new THREE.Vector3(650, 4, 150),
                new THREE.Vector3(600, 0, 150),
                new THREE.Vector3(550, 0, 150),
            ],
            extrudeShapeIndex: 2
        },
        {
            points: [
                new THREE.Vector3(550, 0, 150),
                new THREE.Vector3(500, 0, 150),
                new THREE.Vector3(450, 4, 150),
                new THREE.Vector3(425, 8, 200),
                new THREE.Vector3(425, 8, 250),
                new THREE.Vector3(450, 4, 300),
                new THREE.Vector3(500, 0, 300),
                new THREE.Vector3(550, 0, 300),
            ],
            extrudeShapeIndex: 0
        },
        {
            points: [
                new THREE.Vector3(550, 0, 300),
                new THREE.Vector3(600, 0, 300),
                new THREE.Vector3(650, 4, 300),
                new THREE.Vector3(675, 8, 350),
                new THREE.Vector3(675, 8, 400),
                new THREE.Vector3(650, 4, 450),
                new THREE.Vector3(600, 0, 450),
                new THREE.Vector3(550, 0, 450),
            ],
            extrudeShapeIndex: 2
        },
        {            
            points: [
                new THREE.Vector3(550, 0, 450),
                new THREE.Vector3(450, 0, 450),
            ],
            extrudeShapeIndex: 0
        },
        ... Array(10).fill(0).map((_, i) => {
            return {
                points: [
                    new THREE.Vector3(450 - i * 20, 0, 450),
                    new THREE.Vector3(450 - (i + 1) * 20, 0, 450),
                ],
                extrudeShapeIndex: 0,
                moving: true,
                direction: new THREE.Vector3(0, 0, 10),
                period: 6000,
                phase: i * 1200
            }
        }),
        {
            points: [
                new THREE.Vector3(250, 0, 450),
                new THREE.Vector3(200, 0, 450),
            ],
            extrudeShapeIndex: 0
        },
        {
            points: [
                new THREE.Vector3(200, 0, 458),
                new THREE.Vector3(170, 2, 458),
                new THREE.Vector3(140, 8, 300),
                new THREE.Vector3(100, 8, 270),
                new THREE.Vector3(70, 8, 270),
                new THREE.Vector3(30, 8, 300),
                new THREE.Vector3(0, 2, 458),
                new THREE.Vector3(-30, 0, 458),
            ],
            extrudeShapeIndex: 1
        },
        {
            points: [
                new THREE.Vector3(200, 0, 442),
                new THREE.Vector3(170, -2, 442),
                new THREE.Vector3(140, -8, 600),
                new THREE.Vector3(100, -8, 630),
                new THREE.Vector3(70, -8, 630),
                new THREE.Vector3(30, -8, 600),
                new THREE.Vector3(0, -2, 442),
                new THREE.Vector3(-30, 0, 442),
            ],
            extrudeShapeIndex: 1
        },
        {
            points: [
                new THREE.Vector3(-30, 0, 450),
                new THREE.Vector3(-50, 0, 450),
                new THREE.Vector3(-70, 0, 450),
                new THREE.Vector3(-100, 0, 450),
                new THREE.Vector3(-150, 0, 375),
                new THREE.Vector3(-180, 0, 250),
                new THREE.Vector3(-180, 0, 200),
                new THREE.Vector3(-150, 0, 75),
                new THREE.Vector3(-100, 0, 0),
                new THREE.Vector3(-70, 0, 0),
                new THREE.Vector3(-70, 0, 0),
                new THREE.Vector3(-50, 0, 0),
            ],
            extrudeShapeIndex: 0
        },
    ],
    layers: [
        {
            shapes: [
                new THREE.Shape([
                    new THREE.Vector2(16, 0),
                    new THREE.Vector2(-16, 0),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(8, 0),
                    new THREE.Vector2(-8, 0),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(16, 0),
                    new THREE.Vector2(-16, 0),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(8, 0),
                    new THREE.Vector2(-8, 0),
                ]),
            ],
            material: new THREE.MeshBasicMaterial({ 
                transparent: true, 
                opacity: 0,
                depthWrite: false
            })
        },
        {
            shapes: [
                new THREE.Shape([
                    new THREE.Vector2(15, 0.4),
                    new THREE.Vector2(16, 0.4),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(7, 0.4),
                    new THREE.Vector2(8, 0.4),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(15, -0.4),
                    new THREE.Vector2(16, -0.4,),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(7, -0.4),
                    new THREE.Vector2(8, -0.4),
                ]),
            ],
            material: new THREE.MeshLambertMaterial({ 
                color: 0xdddddd,
                wireframe: false
            })
        },
        {
            shapes: [
                new THREE.Shape([
                    new THREE.Vector2(-15, 0.4),
                    new THREE.Vector2(-16, 0.4),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(-7, 0.4),
                    new THREE.Vector2(-8, 0.4),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(-15, -0.4),
                    new THREE.Vector2(-16, -0.4),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(-7, -0.4),
                    new THREE.Vector2(-8, -0.4),
                ]),
            ],
            material: new THREE.MeshStandardMaterial({ 
                color: 0xdddddd, 
                wireframe: false 
            })
        },
        {
            shapes: [
                new THREE.Shape([
                    new THREE.Vector2(15, 0.4),
                    new THREE.Vector2(-15, 0.4),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(7, 0.4),
                    new THREE.Vector2(-7, 0.4),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(15, -0.4),
                    new THREE.Vector2(-15, -0.4),
                ]),
                new THREE.Shape([
                    new THREE.Vector2(7, -0.4),
                    new THREE.Vector2(-7, -0.4),
                ]),
            ],
            material: new THREE.MeshLambertMaterial({ 
                color: 0xaaaaaa, 
                wireframe: false,
                transparent: true,
                opacity: 0.3,
            })
        }
    ],
    extrudeOptions: {
        steps: 640,
        bevelEnabled: true,
    },
    backgroundColors: ["#000226"],
}

export default track_1;