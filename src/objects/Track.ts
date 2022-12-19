import * as THREE from "three";
import { ICurveData, ITrackData } from "../utils/interfaces";
import { debugAxes, debugPoints, debugLine } from "../utils/debug";

export default class Track {    
    startPoint: THREE.Vector3;
    startDirection: THREE.Vector3;
    startRotation: THREE.Euler;

    body: THREE.Mesh;

    constructor(scene: THREE.Scene, trackData: ITrackData,
        debug?: boolean) {

        this.startPoint = trackData.startPoint;
        this.startDirection = trackData.startDirection;
        this.startRotation = trackData.startRotation;
        
        this.render(scene, trackData, debug);
    }

    // creates a catmull-rom spline
    createCurve(points: Array<THREE.Vector3>, extrudeShape: THREE.Shape, 
        extrudeOptions: THREE.ExtrudeGeometryOptions, material: THREE.Material,
        debug?: boolean, scene?: THREE.Scene): THREE.Mesh {

        if (debug && scene) 
            debugPoints(scene, points);
            
        let curve = new THREE.CatmullRomCurve3(points, false);
        points = curve.getPoints(100);

        if (debug && scene)
            debugLine(scene, points);

        extrudeOptions.extrudePath = curve;
        let geometry = new THREE.ExtrudeGeometry(extrudeShape, extrudeOptions);
        let mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    // combines curves into a single mesh
    createTrack(curves: Array<ICurveData>, extrudeShapes: Array<THREE.Shape>,
        extrudeOptions: THREE.ExtrudeGeometryOptions, material: THREE.Material,
        debug?: boolean, scene?: THREE.Scene): THREE.Mesh {
        
        let meshes: Array<THREE.Mesh> = [];
        for (let curve of curves) {
            let points = curve.points;
            let extrudeShape = extrudeShapes[curve.extrudeShapeIndex];

            let mesh = this.createCurve(points, extrudeShape, 
                extrudeOptions, material, debug, scene);
            
            meshes.push(mesh);
        }

        let track = meshes.shift();
        for (let mesh of meshes) {
            track.add(mesh);
        }

        return track;
    }

    render(scene: THREE.Scene, trackData: ITrackData, debug?: boolean) {
        if (debug)
            debugAxes(scene);

        // make collision layer invisible and above the road
        let transparentMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
        this.body = this.createTrack(trackData.curves, 
            trackData.extrudeShapes, trackData.extrudeOptions, 
            transparentMaterial, debug, scene);
        scene.add(this.body);
        
        let surfaceLayer = this.createTrack(trackData.curves, 
            trackData.surfaceExtrudeShapes, trackData.extrudeOptions, 
            trackData.material, debug, scene);
        scene.add(surfaceLayer);

        let outlineLayer = this.createTrack(trackData.curves, 
            trackData.outlineExtrudeShapes, trackData.extrudeOptions, 
            trackData.outlineMaterial, debug, scene);
        scene.add(outlineLayer);
    }
}