import * as THREE from "three";
import { ITrackData } from "../../src/utils/interfaces";

let track_1: ITrackData = {
    startPoint: new THREE.Vector3(0, 0, 0),
    startDirection: new THREE.Vector3(1, 0, 0).normalize(),
    startRotation: new THREE.Euler(0, Math.PI / 2, 0, "YZX"),
    curves: [
        {
            points: [[-50, 0, 0], [150, 0, 0]],            
            extrudeShapeIndex: 2
        },
        {
            points: [[150, 0, 8], [200, 0, 8], [250, -10, 8],
                [300, 0, 8], [350, 10, 8], [400, 0, 8],
                [450, -10, 8], [500, 0, 8], [550, 0, 8]],
            extrudeShapeIndex: 3
        },
        {
            points: [[150, 0, -8], [200, 0, -8], [250, 10, -8],
                [300, 0, -8], [350, -10, -8], [400, 0, -8],
                [450, 10, -8], [500, 0, -8], [550, 0, -8]],
            extrudeShapeIndex: 3
        },
    ],
    layers: [
        {
            shapes: [[[16, 0], [-16, 0]], [[8, 0], [-8, 0]],
                [[16, 0], [-16, 0]], [[8, 0], [-8, 0]]],
            material: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        },
        {
            shapes: [[[15, 0.4], [16, 0.4]], [[7, 0.4], [8, 0.4]],
                 [[15, -0.4], [16, -0.4]], [[7, -0.4], [8, -0.4]]],
            material: new THREE.MeshLambertMaterial({ color: 0xdddddd })
        },
        {
            shapes: [[[-15, 0.4], [-16, 0.4]], [[-7, 0.4], [-8, 0.4]],
                [[-15, -0.4], [-16, -0.4]], [[-7, -0.4], [-8, -0.4]]],
            material: new THREE.MeshStandardMaterial({ color: 0xdddddd })
        },
        {
            shapes: [[[15, 0.4], [-15, 0.4]], [[7, 0.4], [-7, 0.4]],
                [[15, -0.4], [-15, -0.4]], [[7, -0.4], [-7, -0.4]]],
            material: new THREE.MeshLambertMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 })
        }
    ],
    backgroundColors: ["#000226"],
}

export default track_1;