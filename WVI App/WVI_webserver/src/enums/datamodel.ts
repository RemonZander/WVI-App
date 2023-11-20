export enum Datamodel {
    BatteryVoltage = "Volts",
    ControlTemperature = "Celsius",
    SetPointHigh = "Celsius",
    SetPointLow = "Celsius",
    "Params.DefaultHeatingCurve.SetPointHigh" = "Celsius",
    "Params.DefaultHeatingCurve.SetPointLow" = "Celsius",
    "HeatingCurve.SetPointHigh" = "Celsius",
    "HeatingCurve.SetPointLow" = "Celsius",
    Inlet1Voltage = "Volts",
    Inlet2Voltage = "Volts",
    Inlet3Voltage = "Volts",
    OperatingHours = "Hours",
    OperatingHoursHeating = "Hours",
    TestBurningDuration = "Seconds"
}

module.exports = {
    Datamodel
}