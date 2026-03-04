package com.neurofleetx.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleTelemetryRequest {
    private Double speed;
    private Integer batteryLevel;
    private Integer fuelLevel;
    private Double latitude;
    private Double longitude;
}
