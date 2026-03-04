package com.neurofleetx.service;

import com.neurofleetx.model.TrafficHeatmap;
import com.neurofleetx.repository.TrafficHeatmapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrafficService {

    private final TrafficHeatmapRepository trafficHeatmapRepository;

    public List<TrafficHeatmap> getHeatmapData() {
        return trafficHeatmapRepository.findAll();
    }
}
