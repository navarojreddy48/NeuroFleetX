package com.neurofleetx.repository;

import com.neurofleetx.model.TrafficHeatmap;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrafficHeatmapRepository extends JpaRepository<TrafficHeatmap, Long> {
}
