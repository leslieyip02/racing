import * as THREE from "three";
import { ICurveData, ITrackData, IPlatformData } from "../utils/interfaces";
import { debugAxes, debugPoints, debugLine } from "../utils/debug";

export default class Track {    
    startPoint: THREE.Vector3;
    startDirection: THREE.Vector3;
    startRotation: THREE.Euler;

    body: THREE.Mesh;
    movingPlatforms: Array<IPlatformData>;
    elapsedTime: number;

    constructor(scene: THREE.Scene, trackData: ITrackData,
        debug?: boolean) {

        this.startPoint = trackData.startPoint;
        this.startDirection = trackData.startDirection;
        this.startRotation = trackData.startRotation;
        
        this.elapsedTime = 0;

        this.render(scene, trackData, debug);
    }

    // creates a catmull-rom spline
    createCurve(points: Array<THREE.Vector3>, closed: boolean,
        extrudeShape: THREE.Shape, extrudeOptions: THREE.ExtrudeGeometryOptions, 
        material: THREE.Material, debug?: boolean, scene?: THREE.Scene): THREE.Mesh {

        if (debug && scene) 
            debugPoints(scene, points);
            
        let curve = new THREE.CatmullRomCurve3(points, closed);
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
            let extrudeShape = extrudeShapes[curve.extrudeShapeIndex];

            let mesh = this.createCurve(curve.points, curve.closed || false,
                extrudeShape, extrudeOptions, material, debug, scene);
            
            if (curve.moving) {
                let platform: IPlatformData = {
                    mesh: mesh,
                    origin: mesh.position.clone(),
                    direction: curve.direction,
                    period: curve.period,
                    phase: curve.phase
                }

                this.movingPlatforms.push(platform);
            } else {
                meshes.push(mesh);
            }
        }

        let track = meshes.shift();
        for (let mesh of meshes)
            track.add(mesh);

        return track;
    }

    render(scene: THREE.Scene, trackData: ITrackData, debug?: boolean) {
        if (debug)
            debugAxes(scene);
        
        // set up background gradient
        let background = `linear-gradient(${trackData.backgroundColors.join(", ")})`;
        document.getElementsByTagName("body")[0].style
            .background = background;
        
        // set up grid
        if (trackData.gridColor) {
            let grid = new THREE.GridHelper(1000, 1000, 
                trackData.gridColor, trackData.gridColor);
            scene.add(grid);    
        }

        // set up platforms
        this.movingPlatforms = [];
        
        // make collision layer invisible and above the road
        let collisionLayer = trackData.layers.shift();
        this.body = this.createTrack(trackData.curves, 
            collisionLayer.shapes, trackData.extrudeOptions, 
            collisionLayer.material, debug, scene);
        scene.add(this.body);
        
        // add all layers
        // e.g. surface layer and outline layer
        for (let layerData of trackData.layers) {
            let layer = this.createTrack(trackData.curves,
                layerData.shapes, trackData.extrudeOptions,
                layerData.material, debug, scene);
            scene.add(layer);
        }

        for (let platform of this.movingPlatforms)
            scene.add(platform.mesh);
    }

    update(dt?: number) {
        if (!dt)
            return;

        this.elapsedTime += dt;
        
        for (let platform of this.movingPlatforms) {
            let time = (this.elapsedTime + platform.phase) % platform.period;
            let phase = 2 * Math.PI * (time / platform.period);
            
            // model platform movement on a sinusoidal wave
            let offset = platform.direction.clone()
                .multiplyScalar(Math.sin(phase));

            let position = platform.origin.clone()
                .add(offset);

            platform.mesh.position.set(position.x, position.y, position.z);
        }
    }
}