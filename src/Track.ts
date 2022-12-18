import * as THREE from "three";
import GameScene from "./GameScene";

export default class Track {
    scene: GameScene;
    
    body: THREE.Mesh;
    startPoint: THREE.Vector3;

    constructor(scene: GameScene) {
        this.scene = scene;
        this.startPoint = new THREE.Vector3(30, 2, -10);
    }

    // creates a plane from 4 corners
    createStraight(points: Array<THREE.Vector3>, material: THREE.Material, 
        rotation?: THREE.Euler, debug?: boolean): THREE.Mesh {
        
        let geometry = new THREE.PlaneGeometry().setFromPoints(points);
        let mesh = new THREE.Mesh(geometry, material);

        if (rotation != undefined) 
            mesh.setRotationFromEuler(rotation);

        if (debug) {
            for (let point of points) {
                let geometry = new THREE.SphereGeometry(1, 4, 2);
                let marker = new THREE.Mesh(geometry, material);
                marker.position.set(point.x, point.y + 3, point.z);
                this.scene.add(marker);
            }
        }

        return mesh;
    }

    createCurve(points: Array<THREE.Vector3>, material: THREE.Material, 
        shape: THREE.Shape, options: THREE.ExtrudeGeometryOptions,
        steps?: number, debug?: boolean): THREE.Mesh {

        if (debug) {
            for (let point of points) {
                let markerGeometry = new THREE.SphereGeometry(1, 4, 2);
                let marker = new THREE.Mesh(markerGeometry, material);
                marker.position.set(point.x, point.y + 3, point.z);
                this.scene.add(marker);
            }
        }

        let curve = new THREE.CatmullRomCurve3(points, false);
        points = curve.getPoints(64);

        if (debug) {
            let lineGeometry = new THREE.BufferGeometry()
                .setFromPoints(points);

            let lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
            let line = new THREE.Line(lineGeometry, lineMaterial);
            this.scene.add(line);
        }

        options.extrudePath = curve;
        if (steps)
            options.steps = steps;

        let geometry = new THREE.ExtrudeGeometry(shape, options);
        let mesh = new THREE.Mesh(geometry, material);

        return mesh;
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

        let shape = new THREE.Shape([
            new THREE.Vector2(0, 5),
            new THREE.Vector2(0, -5),
        ]);

        let options = {
            steps: 100,
            bevelEnabled: true,
        };

        let material = new THREE.MeshLambertMaterial({ 
            color: 0x000e54,
            wireframe: false
        });

        this.body = this.createCurve(points, material, shape, options);
        this.scene.add(this.body);

        // if (debug) {
        //     for (let i = 0; i < points.length; i++) {
        //         let point: THREE.Vector3 = points[i];
        //         let markerGeometry = new THREE.SphereGeometry(1, 4, 2);
        //         let markerMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        //         let marker = new THREE.Mesh(markerGeometry, markerMaterial);
        //         marker.position.set(point.x, point.y + 3, point.z);
        //         this.scene.add(marker);
        //     }
        // }

        // let track = new THREE.CatmullRomCurve3(points, false);
        // this.points = track.getPoints(320);

        // if (debug) {
        //     let lineGeometry = new THREE.BufferGeometry()
        //         .setFromPoints(this.points);

        //     let lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        //     let line = new THREE.Line(lineGeometry, lineMaterial);
        //     this.scene.add(line);
        // }

        // let extrudeSettings = {
        //     steps: 320,
        //     bevelEnabled: true,
        //     extrudePath: track
        // };

        // let trackGeometry = new THREE.ExtrudeGeometry(new THREE.Shape([
        //     new THREE.Vector2(0, 5),
        //     new THREE.Vector2(0, -5),
        // ]), extrudeSettings);

        // let trackMaterial = new THREE.MeshLambertMaterial({ 
        //     color: 0x000e54,
        //     wireframe: false
        // });
        
        // this.body = new THREE.Mesh(trackGeometry, trackMaterial);
        // this.body.translateY(0.2);
        // this.scene.add(this.body);
        
        // let bottomGeometry = new THREE.ExtrudeGeometry(new THREE.Shape([
        //     new THREE.Vector2(0, 5.6),
        //     new THREE.Vector2(0, -5.6),
        // ]), extrudeSettings);

        // let bottomMaterial = new THREE.MeshStandardMaterial({ 
        //     color: 0x99ccff, 
        //     wireframe: false 
        // });
        
        // let bottomLayer = new THREE.Mesh(bottomGeometry, bottomMaterial);
        // bottomLayer.translateY(0.1);
        // this.scene.add(bottomLayer);
    }
}