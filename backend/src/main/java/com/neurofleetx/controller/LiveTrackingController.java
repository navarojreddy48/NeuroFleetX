package com.neurofleetx.controller;

import com.neurofleetx.model.LiveTracking;
import com.neurofleetx.service.LiveTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/live-tracking")
@RequiredArgsConstructor
public class LiveTrackingController {

    private final LiveTrackingService liveTrackingService;

    @GetMapping("/trip/{tripId}")
    public List<LiveTracking> getByTrip(@PathVariable Long tripId) {
        return liveTrackingService.getTrackingByTripId(tripId);
    }
}
