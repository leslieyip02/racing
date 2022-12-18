import * as THREE from "three";
import GameScene from "./GameScene";

export default class Track {
    scene: GameScene;
    
    points: Array<THREE.Vector3>;
    body: THREE.Mesh;

    constructor(scene: GameScene) {
        this.scene = scene;
    }

    render(debug: boolean = false) {
        let points: Array<THREE.Vector3> = [
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
        ];

        if (debug) {
            for (let i = 0; i < points.length; i++) {
                let point: THREE.Vector3 = points[i];
                let markerGeometry = new THREE.SphereGeometry(1, 4, 2);
                let markerMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
                let marker = new THREE.Mesh(markerGeometry, markerMaterial);
                marker.position.set(point.x, point.y + 3, point.z);
                this.scene.add(marker);
            }
        }

        let track = new THREE.CatmullRomCurve3(points, false);
        this.points = track.getPoints(320);

        if (debug) {
            let lineGeometry = new THREE.BufferGeometry()
                .setFromPoints(this.points);

            let lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
            let line = new THREE.Line(lineGeometry, lineMaterial);
            this.scene.add(line);
        }

        let extrudeSettings = {
            steps: 320,
            bevelEnabled: true,
            extrudePath: track
        };

        let trackGeometry = new THREE.ExtrudeGeometry(new THREE.Shape([
            new THREE.Vector2(0, 5),
            new THREE.Vector2(0, -5),
        ]), extrudeSettings);

        let trackMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x000e54,
            wireframe: false
        });
        
        this.body = new THREE.Mesh(trackGeometry, trackMaterial);
        this.body.translateY(0.2);
        this.scene.add(this.body);
        
        let bottomGeometry = new THREE.ExtrudeGeometry(new THREE.Shape([
            new THREE.Vector2(0, 5.6),
            new THREE.Vector2(0, -5.6),
        ]), extrudeSettings);

        let bottomMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x99ccff, 
            wireframe: false 
        });
        
        let bottomLayer = new THREE.Mesh(bottomGeometry, bottomMaterial);
        bottomLayer.translateY(0.1);
        this.scene.add(bottomLayer);
    }
}