import * as THREE from "three";

export default class StartLine extends THREE.Group {
    constructor(position: THREE.Vector3, rotation: THREE.Euler,
        scene: THREE.Scene) {
            
        super();
        let bannerMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
        let bannerGeometry = new THREE.PlaneGeometry(36, 5);
        let bannerMesh = new THREE.Mesh(bannerGeometry, bannerMaterial);
        bannerMesh.position.set(position.x, position.y + 8, position.z);
        bannerMesh.setRotationFromEuler(rotation);
        this.add(bannerMesh);
        
        let polePoints = [
            new THREE.Vector3(position.x, -2, position.z + 18),
            new THREE.Vector3(position.x, position.y + 12, position.z + 18)
        ];
        let polePath = new THREE.CatmullRomCurve3(polePoints);
        let poleGeometry = new THREE.TubeGeometry(polePath, 8, 1, 6, true);
        let poleMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, 
            wireframe: true, side: THREE.DoubleSide });
        let poleMesh = new THREE.Mesh(poleGeometry, poleMaterial);
        this.add(poleMesh);
        
        poleMesh = poleMesh.clone();
        poleMesh.translateZ(-36);
        this.add(poleMesh);

        scene.add(this);
    }
}