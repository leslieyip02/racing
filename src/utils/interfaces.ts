interface IControls {
    [key: string]: boolean; 
}

interface ICurveData {
    points: Array<THREE.Vector3>,
    closed: boolean
    extrudeShapeIndex: number
}

interface ITrackData {
    startPoint: THREE.Vector3,
    startDirection: THREE.Vector3,
    startRotation: THREE.Euler,
    curves: Array<ICurveData>,
    extrudeShapes: Array<THREE.Shape>,
    surfaceExtrudeShapes: Array<THREE.Shape>,
    outlineExtrudeShapes: Array<THREE.Shape>,
    extrudeOptions: THREE.ExtrudeGeometryOptions,
    surfaceMaterial: THREE.Material,
    outlineMaterial: THREE.Material,
    backgroundColors: Array<string>,
    gridColor: number | THREE.Color
}

interface IVehicleData {
    acceleration: number,
    friction: number,
    turnRate: number
}

export {
    IControls,
    ICurveData,
    ITrackData,
    IVehicleData
}