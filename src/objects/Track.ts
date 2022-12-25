import * as THREE from "three";
import { ICurveData, ITrackData, IPlatform } from "../utils/interfaces";
import { debugAxes, debugPoints, debugLine } from "../utils/debug";

export default class Track {    
    startPoint: THREE.Vector3;
    startDirection: THREE.Vector3;
    startRotation: THREE.Euler;

    body: THREE.Mesh;
    movingPlatforms: Array<IPlatform>;
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

            let mesh = this.createCurve(curve.points, curve.closed,
                extrudeShape, extrudeOptions, material, debug, scene);
            
            if (curve.moving) {
                let platform = {
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
        let grid = new THREE.GridHelper(1000, 1000, 
            trackData.gridColor, trackData.gridColor);
        scene.add(grid);    

        // set up movingData platforms
        this.movingPlatforms = [];

        // make collision layer invisible and above the road
        let transparentMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
        this.body = this.createTrack(trackData.curves, 
            trackData.extrudeShapes, trackData.extrudeOptions, 
            transparentMaterial, debug, scene);
        scene.add(this.body);
        
        let surfaceLayer = this.createTrack(trackData.curves, 
            trackData.surfaceExtrudeShapes, trackData.extrudeOptions, 
            trackData.surfaceMaterial, debug, scene);
        scene.add(surfaceLayer);

        let outlineLayer = this.createTrack(trackData.curves, 
            trackData.outlineExtrudeShapes, trackData.extrudeOptions, 
            trackData.outlineMaterial, debug, scene);
        scene.add(outlineLayer);

        for (let platform of this.movingPlatforms)
        {
            console.log(platform.mesh)
            scene.add(platform.mesh);
        }
    }

    update(dt?: number) {
        if (!dt)
            return;

        this.elapsedTime += dt;
        
        for (let platform of this.movingPlatforms) {
            let time = (this.elapsedTime + platform.phase) % platform.period;
            let phase = 2 * Math.PI * (time / platform.period);
            let offset = platform.direction.clone()
                .multiplyScalar(Math.sin(phase));

            let position = platform.origin.clone()
                .add(offset);

            console.log(time, phase, Math.sin(phase), offset, position)
            // debugger

            platform.mesh.position.set(position.x, position.y, position.z);
        }
    }
}