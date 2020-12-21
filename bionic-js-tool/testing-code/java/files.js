const hostFiles = [
    {path: 'Bicycle.java', bundles: ['main']},
    {path: 'BjsMotorVehicles/BjsBeautifulVehicles.java', bundles: ['main']},
    {path: 'BjsVehicles/BjsBeautifulVehicles.java', bundles: ['main']},
    {path: 'FerrariCalifornia.java', bundles: ['main']},
    {path: 'TeslaRoadster.java', bundles: ['main']},
    {path: 'libs/FuelType.java', bundles: ['main']},
    {path: 'libs/MotorVehicle.java', bundles: ['main']},
    {path: 'libs/Vehicle.java', bundles: ['main']},
    {path: 'native/BaseEngineBjsExport.java', bundles: ['main']},
    {path: 'native/EngineBjsExport.java', bundles: ['main']}]

const bundleFiles = [
    {path: 'MotorVehicles.bjs.bundle/MotorVehicles.js', bundle: 'main'},
    {path: 'Vehicles.bjs.bundle/Vehicles.js', bundle: 'main'},
]

module.exports = {hostFiles, bundleFiles}