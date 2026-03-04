package com.neurofleetx.controller;

import com.neurofleetx.model.TrafficHeatmap;
import com.neurofleetx.service.TrafficService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/traffic")
@RequiredArgsConstructor
public class TrafficController {

    private final TrafficService trafficService;

    @GetMapping("/heatmap")
    public List<TrafficHeatmap> getHeatmap() {
        return trafficService.getHeatmapData();
    }
}
