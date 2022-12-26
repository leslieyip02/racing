interface IControls {
    [key: string]: boolean;
}

interface ICurveData {
    points: Array<THREE.Vector3>;
    extrudeShapeIndex: number
    closed?: boolean;
    moving?: boolean;
    direction?: THREE.Vector3;
    period?: number;
    phase?: number;
}

interface IPlatform {
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
    extrudeShapes: Array<THREE.Shape>;
    surfaceExtrudeShapes: Array<THREE.Shape>;
    outlineExtrudeShapes: Array<THREE.Shape>;
    extrudeOptions: THREE.ExtrudeGeometryOptions;
    surfaceMaterial: THREE.Material;
    outlineMaterial: THREE.Material;
    backgroundColors: Array<string>;
    gridColor: number | THREE.Color;
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
    IPlatform,
    ITrackData,
    IVehicleData
}