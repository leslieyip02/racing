import * as THREE from "three";

// static debug functions
function debugAxes(scene: THREE.Scene, size: number = 1000): void {
    let helper = new THREE.AxesHelper(size);
    scene.add(helper);
}

function debugPoints(scene: THREE.Scene, points: Array<THREE.Vector3>, 
    color: number = 0xffff00): void {

    let material = new THREE.MeshBasicMaterial({ color: color });
    for (let point of points) {
        let geometry = new THREE.SphereGeometry(1, 4, 2);
        let marker = new THREE.Mesh(geometry, material);
        marker.position.set(point.x, point.y + 3, point.z);
        scene.add(marker);
    }
}

function debugLine(scene: THREE.Scene, points: Array<THREE.Vector3>,
    color: number = 0xffff00): void {

    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let material = new THREE.LineBasicMaterial({ color: color });
    let line = new THREE.Line(geometry, material);
    scene.add(line);
}

// dynamic debug classes that require updates
class DebugVector {    
    vector: THREE.Vector3;
    origin: THREE.Vector3;
    helper: THREE.ArrowHelper;
    
    constructor(scene: THREE.Scene, vector: THREE.Vector3, 
        origin: THREE.Vector3, length: number = 3, 
        color: number = 0xffff00) {
        
        this.vector = vector;
        this.origin = origin;
        this.helper = new THREE.ArrowHelper(this.vector, 
            this.origin, length, color);

        scene.add(this.helper);
    }

    update(vector: THREE.Vector3, origin: THREE.Vector3) {
        this.vector = vector;
        this.origin = origin;

        this.helper.setDirection(this.vector);
        this.helper.position.set(this.origin.x, 
            this.origin.y, this.origin.z);
    }
}

export {
    debugAxes, 
    debugPoints,
    debugLine, 
    DebugVector
}