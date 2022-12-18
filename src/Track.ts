import * as THREE from "three";
import GameScene from "./GameScene";
import { ITrackData } from "./utils/interfaces";

export default class Track {
    scene: GameScene;
    
    trackData: ITrackData;
    
    body: THREE.Mesh;
    startPoint: THREE.Vector3;

    constructor(scene: GameScene, trackData: ITrackData) {
        this.scene = scene;
        this.trackData = trackData;
    }

    // creates a plane from 4 corners
    createStraight(points: Array<THREE.Vector3>, material: THREE.Material, 
        rotation?: THREE.Euler, debug?: boolean): THREE.Mesh {
        
        let geometry = new THREE.PlaneGeometry().setFromPoints(points);
        let mesh = new THREE.Mesh(geometry, material);

        if (rotation) 
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

    // creates a catmull-rom spline
    createCurve(points: Array<THREE.Vector3>, material: THREE.Material, 
        shape: THREE.Shape, extrudeOptions: THREE.ExtrudeGeometryOptions,
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
        points = curve.getPoints(100);

        if (debug) {
            let lineGeometry = new THREE.BufferGeometry()
                .setFromPoints(points);

            let lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
            let line = new THREE.Line(lineGeometry, lineMaterial);
            this.scene.add(line);
        }

        extrudeOptions.extrudePath = curve;

        if (steps)
            extrudeOptions.steps = steps;

        let geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
        let mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    createTrack(straights: Array<Array<THREE.Vector3>>, 
        curves: Array<Array<THREE.Vector3>>, material: THREE.Material,
        shape: THREE.Shape, extrudeOptions: THREE.ExtrudeGeometryOptions,
        debug?: boolean): THREE.Mesh {
        
        let meshes: Array<THREE.Mesh> = [];

        for (let straight of straights) {
            let mesh = this.createStraight(straight, material, null, debug);
            meshes.push(mesh);
        }

        for (let curve of curves) {
            let mesh = this.createCurve(curve, material, shape, extrudeOptions, null, debug);
            meshes.push(mesh);
        }

        let track = meshes.shift();
        for (let mesh of meshes) {
            track.add(mesh);
        }

        return track;
    }

    render(debug: boolean = false) {
        this.startPoint = this.trackData.startPoint;

        this.body = this.createTrack(this.trackData.straights, 
            this.trackData.curves, this.trackData.material, 
            this.trackData.extrudeShape, this.trackData.extrudeOptions, debug);

        this.scene.add(this.body);

        let outlineLayer = this.createTrack(this.trackData.outlineLayer.straights, 
            this.trackData.curves, this.trackData.outlineLayer.material, 
            this.trackData.outlineLayer.extrudeShape, this.trackData.extrudeOptions, debug);

        this.scene.add(outlineLayer);
    }
}