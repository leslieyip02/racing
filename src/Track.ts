import * as THREE from "three";
import GameScene from "./GameScene";
import { ICurveData, ITrackData } from "./utils/interfaces";
import { debugPoints, debugLine } from "./utils/debug";

export default class Track {
    scene: GameScene;
    
    trackData: ITrackData;
    
    body: THREE.Mesh;
    startPoint: THREE.Vector3;

    constructor(scene: GameScene, trackData: ITrackData) {
        this.scene = scene;
        this.trackData = trackData;
    }

    // creates a catmull-rom spline
    createCurve(points: Array<THREE.Vector3>, extrudeShape: THREE.Shape, 
        extrudeOptions: THREE.ExtrudeGeometryOptions, material: THREE.Material,
        debug?: boolean): THREE.Mesh {

        if (debug) 
            debugPoints(this.scene, points);
            
        let curve = new THREE.CatmullRomCurve3(points, false);
        points = curve.getPoints(100);

        if (debug)
            debugLine(this.scene, points);

        extrudeOptions.extrudePath = curve;
        let geometry = new THREE.ExtrudeGeometry(extrudeShape, extrudeOptions);
        let mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    createTrack(curves: Array<ICurveData>, extrudeShapes: Array<THREE.Shape>,
        extrudeOptions: THREE.ExtrudeGeometryOptions, material: THREE.Material,
        debug?: boolean): THREE.Mesh {
        
        let meshes: Array<THREE.Mesh> = [];

        for (let curve of curves) {
            let points = curve.points;
            let extrudeShape = extrudeShapes[curve.extrudeShapeIndex];

            let mesh = this.createCurve(points, extrudeShape, 
                extrudeOptions, material, debug);
            
            meshes.push(mesh);
        }

        let track = meshes.shift();
        for (let mesh of meshes) {
            track.add(mesh);
        }

        return track;
    }

    render(debug?: boolean) {
        this.startPoint = this.trackData.startPoint;

        this.body = this.createTrack(this.trackData.curves, 
            this.trackData.extrudeShapes, this.trackData.extrudeOptions, 
            this.trackData.material, debug);

        this.scene.add(this.body);

        let outlineLayer = this.createTrack(this.trackData.curves, 
            this.trackData.outlineExtrudeShapes, this.trackData.extrudeOptions, 
            this.trackData.outlineMaterial, debug);

        this.scene.add(outlineLayer);
    }
}