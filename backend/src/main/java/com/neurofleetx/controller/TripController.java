package com.neurofleetx.controller;

import com.neurofleetx.model.Trip;
import com.neurofleetx.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping
    public List<Trip> getTrips() {
        return tripService.getAllTrips();
    }

    @PostMapping
    public Trip createTrip(@RequestBody Trip request) {
        return tripService.createTrip(request);
    }

    @GetMapping("/driver/{driverId}")
    public List<Trip> getTripsByDriver(@PathVariable Long driverId) {
        return tripService.getTripsByDriverId(driverId);
    }
}
