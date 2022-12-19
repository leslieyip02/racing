interface IControls {
    [key: string]: boolean; 
}

interface ICurveData {
    points: Array<THREE.Vector3>,
    extrudeShapeIndex: number
}

interface ITrackData {
    startPoint: THREE.Vector3,
    curves: Array<ICurveData>,
    extrudeShapes: Array<THREE.Shape>,
    outlineExtrudeShapes: Array<THREE.Shape>,
    extrudeOptions: THREE.ExtrudeGeometryOptions,
    material: THREE.Material,
    outlineMaterial: THREE.Material
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