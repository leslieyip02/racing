import * as THREE from "three";

function toVectorArray(points: Array<[x: number, y: number, z: number]>): Array<THREE.Vector3> {
    return points.map(point => new THREE.Vector3(point[0], point[1], point[2]));
}

function toShapeArray(shapes: Array<Array<[x: number, y: number]>>): Array<THREE.Shape> {
    return shapes.map(shape => new THREE.Shape(shape.map(
        point => new THREE.Vector2(point[0], point[1])
    )));
}

function randomVector(): THREE.Vector3 {
    return new THREE.Vector3(
        Math.random() * (Math.random() < 0.5 ? 1 : -1),
        Math.random() * (Math.random() < 0.5 ? 1 : -1),
        Math.random() * (Math.random() < 0.5 ? 1 : -1)
    );
}

export {
    toVectorArray,
    toShapeArray,
    randomVector
}