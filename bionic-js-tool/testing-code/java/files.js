const hostFiles = [
    {path: 'Bicycle.java', bundles: ['Vehicles'], sourceSets: ['bicycle', 'vehicles']},
    {path: 'BjsMotorVehicles/BjsBeautifulVehicles.java', bundles: ['MotorVehicles'], sourceSets: ['motor-vehicles']},
    {path: 'BjsVehicles/BjsBeautifulVehicles.java', bundles: ['Vehicles'], sourceSets: ['bicycle', 'vehicles']},
    {path: 'FerrariCalifornia.java', bundles: ['MotorVehicles'], sourceSets: ['motor-vehicles']},
    {path: 'TeslaRoadster.java', bundles: ['MotorVehicles'], sourceSets: ['motor-vehicles']},
    {path: 'libs/FuelType.java', bundles: ['MotorVehicles'], sourceSets: ['motor-vehicles']},
    {path: 'libs/MotorVehicle.java', bundles: ['MotorVehicles'], sourceSets: ['motor-vehicles']},
    {path: 'libs/Vehicle.java', bundles: ['MotorVehicles', 'Vehicles'], sourceSets: ['main']},
    {path: '$native$/BaseEngineBjsExport.java', bundles: ['MotorVehicles'], sourceSets: ['motor-vehicles']},
    {path: '$native$/EngineBjsExport.java', bundles: ['MotorVehicles'], sourceSets: ['motor-vehicles']},
]

const bundleFiles = [
    {path: 'MotorVehicles.bjs.bundle/MotorVehicles.js', bundle: 'MotorVehicles', sourceSets: ['motor-vehicles']},
    {path: 'Vehicles.bjs.bundle/Vehicles.js', bundle: 'Vehicles', sourceSets: ['bicycle', 'vehicles']},
]

module.exports = {hostFiles, bundleFiles}