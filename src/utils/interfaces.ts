interface IKeysPressed {
    [key: string]: boolean; 
}

interface ITrackData {
    startPoint: THREE.Vector3,
    straights: Array<Array<THREE.Vector3>>,
    curves: Array<Array<THREE.Vector3>>,
    material: THREE.Material,
    extrudeShape: THREE.Shape,
    extrudeOptions: THREE.ExtrudeGeometryOptions,
    outlineLayer: {
        straights: Array<Array<THREE.Vector3>>,
        material: THREE.Material,
        extrudeShape: THREE.Shape
    }
}

interface IVehicleData {
    acceleration: number,
    friction: number,
    turnRate: number
}

export {
    IKeysPressed,
    ITrackData,
    IVehicleData
}