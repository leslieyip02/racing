import * as THREE from "three";
import { ITrackData } from "../../src/utils/interfaces";

let defaultTrack: ITrackData = {
    startPoint: new THREE.Vector3(30, 2, -10),
    straights: [],
    curves: [
        [
            new THREE.Vector3(30, 2, -10),
            new THREE.Vector3(20, 2, -80),
            new THREE.Vector3(-10, 6, -150),
            new THREE.Vector3(10, 4, -210),
            new THREE.Vector3(-30, 4, -210),
            new THREE.Vector3(-90, 2, -120),
            new THREE.Vector3(-200, 2, -120),
            new THREE.Vector3(-200, 1, -40),
            new THREE.Vector3(-100, 1, -40),
            new THREE.Vector3(-80, 2, 2),
            new THREE.Vector3(-100, 2, 60),
            new THREE.Vector3(-70, 2, 110),
            new THREE.Vector3(-30, 2, 100),
            new THREE.Vector3(-20, 10, 80),
        ]
    ],
    material: new THREE.MeshLambertMaterial({ 
        color: 0x000e54,
        wireframe: false
    }),
    extrudeShape: new THREE.Shape([
        new THREE.Vector2(0, 5),
        new THREE.Vector2(0, -5),
    ]),
    extrudeOptions: {
        steps: 100,
        bevelEnabled: true,
    },
    outlineLayer: {
        straights: [],
        extrudeShape: new THREE.Shape([
            new THREE.Vector2(0.1, 5.6),
            new THREE.Vector2(0.1, -5.6),
        ]),
        material: new THREE.MeshStandardMaterial({ 
            color: 0x99ccff, 
            wireframe: false 
        })
    }
}

export default defaultTrack;