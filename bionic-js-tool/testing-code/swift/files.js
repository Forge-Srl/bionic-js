const hostFiles = [
    {path: 'Bicycle.swift', bundles: ['Vehicles']},
    {path: 'BjsMotorVehicles/BjsBeautifulVehicles.swift', bundles: ['MotorVehicles']},
    {path: 'BjsVehicles/BjsBeautifulVehicles.swift', bundles: ['Vehicles']},
    {path: 'FerrariCalifornia.swift', bundles: ['MotorVehicles']},
    {path: 'TeslaRoadster.swift', bundles: ['MotorVehicles']},
    {path: 'libs/FuelType.swift', bundles: ['MotorVehicles']},
    {path: 'libs/MotorVehicle.swift', bundles: ['MotorVehicles']},
    {path: 'libs/Vehicle.swift', bundles: ['MotorVehicles', 'Vehicles']},
    {path: 'native/BaseEngineBjsWrapper.swift', bundles: ['MotorVehicles']},
    {path: 'native/EngineBjsWrapper.swift', bundles: ['MotorVehicles']},
]

const bundleFiles = [
    {path: 'BjsMotorVehicles/MotorVehicles.bjs.bundle/MotorVehicles.js', bundle: 'MotorVehicles'},
    {path: 'BjsVehicles/Vehicles.bjs.bundle/Vehicles.js', bundle: 'Vehicles'},
]

module.exports = {hostFiles, bundleFiles}