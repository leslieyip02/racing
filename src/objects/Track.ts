import * as THREE from "three";
import { toVectorArray, toShapeArray } from "../utils/geometry";
import { CurveData, LayerData, Platform, CheckpointData, Checkpoint, TrackData } from "../utils/interfaces";
import { debugAxes, debugPoints, debugLine, debugVector } from "../utils/debug";
import { Sign, StartLine } from "../decorations/decorations";

export default class Track {    
    startPoint: THREE.Vector3;
    startDirection: THREE.Vector3;
    startRotation: THREE.Euler;

    body: THREE.Mesh;
    checkpoints: Array<Checkpoint>;
    movingPlatforms: Array<Platform>;
    elapsedTime: number;

    pathPoints: Array<THREE.Vector3>;
    pathVectors: Array<THREE.Vector3>;

    constructor(scene: THREE.Scene, trackData: TrackData, debug?: boolean) {
        this.startPoint = trackData.startPoint;
        this.startDirection = trackData.startDirection;
        this.startRotation = trackData.startRotation;

        this.elapsedTime = 0;

        this.pathPoints = [];
        this.pathVectors = [];

        this.createCheckpoints(trackData.checkpoints, scene, debug);
        this.render(scene, trackData, debug);
    }

    createCheckpoints(checkpointData: Array<CheckpointData>, 
        scene: THREE.Scene, debug?: boolean) {
        
        this.checkpoints = [];

        let material = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            wireframe: true,
            transparent: !debug,
            opacity: 0
        });

        for (let i = 0; i < checkpointData.length; i++) {
            let data = checkpointData[i];
            let width = data.width || 48;
            let height = data.height || 8;

            let geometry = new THREE.PlaneGeometry(width, height);
            let mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.set(data.position.x, data.position.y, data.position.z);
            mesh.setRotationFromEuler(data.resetRotation);
            scene.add(mesh);
            
            // checkpoint index is 1-based index for modular arithmetic
            let checkpoint: Checkpoint = {
                mesh: mesh,
                resetDirection: data.resetDirection,
                resetRotation: data.resetRotation,
                index: i + 1
            }

            this.checkpoints.push(checkpoint);
        }
    }

    // store direction vectors for each point for CPU player
    createPathVectors(points: Array<THREE.Vector3>, divisions: number,
        debug?: boolean, scene?: THREE.Scene) {

        for (let i = 0; i < divisions - 1; i++) {
            let p1 = points[i].clone();
            let p2 = points[i + 1].clone();

            this.pathPoints.push(p1.clone());

            let directionVector = p2.clone().sub(p1.clone());
            // directionVector.y = 0;
            directionVector.normalize();
            this.pathVectors.push(directionVector);

            if (debug) {
                let origin = p1.clone();
                origin.y += 0.5;
                debugVector(scene, directionVector, origin, 2, 0x00ff00);
            }
        }
    }

    // creates a catmull-rom spline
    createCatmullRom(points: Array<THREE.Vector3>, closed: boolean, divisions: number,
        extrudeShape: THREE.Shape, extrudeOptions: THREE.ExtrudeGeometryOptions, 
        material: THREE.Material, debug?: boolean, scene?: THREE.Scene): THREE.Mesh {
            
        if (debug && scene)
            debugPoints(scene, points, 0x00ffff);

        let curve = new THREE.CatmullRomCurve3(points, closed);
        points = curve.getPoints(divisions);
        this.createPathVectors(points, divisions, debug, scene);

        if (debug && scene)
            debugLine(scene, points, 0x00ffff);

        extrudeOptions.extrudePath = curve;

        let geometry = new THREE.ExtrudeGeometry(extrudeShape, extrudeOptions);
        let mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    // creates an elliptical curve
    createEllipse(origin: THREE.Vector3, radius: [x: number, y: number],
        angles: [start: number, end: number], clockwise: boolean, divisions: number,
        extrudeShape: THREE.Shape, extrudeOptions: THREE.ExtrudeGeometryOptions, 
        material: THREE.Material, debug?: boolean, scene?: THREE.Scene): THREE.Mesh {
        
        if (debug && scene) 
            debugPoints(scene, [origin], 0x00ffff);
        
        // ellipse is created in 2d
        let ellipse = new THREE.EllipseCurve(origin.x, origin.z, 
            radius[0], radius[1], angles[0], angles[1], clockwise, 0);
        
        // make curve 3d for extrusion
        let curve = new THREE.CurvePath<THREE.Vector3>();
        let points = ellipse.getPoints(divisions).map(point => 
            new THREE.Vector3(point.x, origin.y, point.y));
        this.createPathVectors(points, divisions, debug, scene);

        if (debug && scene)
            debugLine(scene, points, 0x00ffff);

        for (let i = 0; i < divisions; i++)
            curve.add(new THREE.LineCurve3(points[i], points[i + 1]));

        extrudeOptions.extrudePath = curve;

        let geometry = new THREE.ExtrudeGeometry(extrudeShape, extrudeOptions);
        let mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    createPlatform(mesh: THREE.Mesh, data: CurveData) {
        let platform: Platform = {
            mesh: mesh,
            origin: mesh.position.clone(),
            movingDirection: data.movingDirection,
            period: data.period,
            phase: data.phase
        }

        this.movingPlatforms.push(platform);
    }

    // combines curves into a single mesh
    createTrack(curveData: Array<CurveData>, layer: LayerData,
        debug?: boolean, scene?: THREE.Scene): THREE.Mesh {
        
        let meshes: Array<THREE.Mesh> = [];

        let extrudeShapes = toShapeArray(layer.shapes);
        let defaultExtrudeOptions = { steps: 100, bevelEnabled: true };

        for (let data of curveData) {
            let mesh: THREE.Mesh;

            let points = toVectorArray(data.points);
            let divisions = data.divisions || 100;
            let extrudeShape = extrudeShapes[data.extrudeShapeIndex];
            let extrudeOptions = data.extrudeOptions || defaultExtrudeOptions;
            let material = layer.material;
            
            if (data.ellipse) {
                mesh = this.createEllipse(points[0], data.radius, 
                    data.angles, data.clockwise, divisions, 
                    extrudeShape, extrudeOptions, material, debug, scene);
            } else {
                let closed = data.closed || false;
                mesh = this.createCatmullRom(points, closed, divisions, 
                    extrudeShape, extrudeOptions, material, debug, scene);
            }
            
            if (data.moving)
                this.createPlatform(mesh, data);
            else
                meshes.push(mesh);
        }

        let track = meshes.shift();
        for (let mesh of meshes)
            track.add(mesh);

        return track;
    }

    render(scene: THREE.Scene, trackData: TrackData, debug?: boolean) {
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
        let collisionLayer = trackData.layerData.shift();
        this.body = this.createTrack(trackData.curveData, 
            collisionLayer, debug, scene);
        scene.add(this.body);
        
        // add all layers
        // e.g. surface layer and outline layer
        for (let layerData of trackData.layerData) {
            let layer = this.createTrack(trackData.curveData,
                layerData, debug, scene);
            scene.add(layer);
        }

        for (let platform of this.movingPlatforms)
            scene.add(platform.mesh);

        // add decorations
        let startLine = new StartLine(this.checkpoints[0].mesh.position, 
            this.checkpoints[0].mesh.rotation, scene);

        for (let signPoints of trackData.signsPoints) {
            let sign = new Sign(signPoints, scene);
        }
    }

    update(dt?: number) {
        if (!dt)
            return;

        this.elapsedTime += dt;

        let minutes = this.elapsedTime / 60000;
        let seconds = (this.elapsedTime % 60000) / 1000;
        let centiseconds = (this.elapsedTime / 10) % 100;

        let timeUnitStrings = [minutes, seconds, centiseconds]
            .map(t => Math.floor(t).toString().padStart(2, "0"));

        document.getElementById("timer").innerHTML = timeUnitStrings.join(":");
        
        for (let platform of this.movingPlatforms) {
            let time = (this.elapsedTime + platform.phase) % platform.period;
            let phase = 2 * Math.PI * (time / platform.period);
            
            // model platform movement on a sinusoidal wave
            let offset = platform.movingDirection.clone()
                .multiplyScalar(Math.sin(phase));

            let position = platform.origin.clone()
                .add(offset);

            platform.mesh.position.set(position.x, position.y, position.z);
        }
    }
}