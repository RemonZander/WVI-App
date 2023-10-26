export enum Datamodel {
    BatteryVoltage = "Volts",
    ControlTemperature = "°C",
    SetPointHigh = "°C",
    SetPointLow = "°C",
    "Params.DefaultHeatingCurve.SetPointHigh" = "°C",
    "Params.DefaultHeatingCurve.SetPointLow" = "°C",
    "HeatingCurve.SetPointHigh" = "°C",
    "HeatingCurve.SetPointLow" = "°C",
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