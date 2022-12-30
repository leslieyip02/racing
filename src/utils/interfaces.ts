// store what keys are pressed
interface IControls {
    [key: string]: boolean;
}

// store an array of points which then create a curve
// the extrude shapes may need to change depending on 
// the orientation of the curve
interface ICurveData {
    points: Array<[x: number, y: number, z: number]>;
    closed?: boolean;
    
    ellipse?: boolean;
    radius?: [x: number, y: number];
    angles?: [start: number, end: number]
    clockwise?: boolean;
    divisions?: number

    extrudeShapeIndex: number
    extrudeOptions?: THREE.ExtrudeGeometryOptions;

    moving?: boolean;
    direction?: THREE.Vector3;
    period?: number;
    phase?: number;
}

// the track is rendered in multiple layers
interface ILayerData {
    shapes: Array<Array<[x: number, y: number]>>;
    material: THREE.Material;
}

// data for platform movement
interface IPlatformData {
    mesh: THREE.Mesh;
    origin: THREE.Vector3;
    direction: THREE.Vector3;
    period: number;
    phase: number;
}

interface ITrackData {
    startPoint: THREE.Vector3;
    startDirection: THREE.Vector3;
    startRotation: THREE.Euler;
    curves: Array<ICurveData>;
    layers: Array<ILayerData>;
    backgroundColors: Array<string>;
    gridColor?: number | THREE.Color;
}

interface IVehicleData {
    modelPath: string;

    acceleration: number;
    deceleration: number;
    friction: number;
    turnRate: number;
    maxRoll: number;
    
    width: number;
    height: number;
    length: number;
}

export {
    IControls,
    ICurveData,
    ILayerData,
    IPlatformData,
    ITrackData,
    IVehicleData
}