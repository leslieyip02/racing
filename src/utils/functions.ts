import * as THREE from "three";

function randomVector(): THREE.Vector3 {
    return new THREE.Vector3(
        Math.random() * (Math.random() < 0.5 ? 1 : -1),
        Math.random() * (Math.random() < 0.5 ? 1 : -1),
        Math.random() * (Math.random() < 0.5 ? 1 : -1)
    );
}

export {
    randomVector
}