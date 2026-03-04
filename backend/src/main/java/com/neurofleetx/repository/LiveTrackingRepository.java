package com.neurofleetx.repository;

import com.neurofleetx.model.LiveTracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LiveTrackingRepository extends JpaRepository<LiveTracking, Long> {
    List<LiveTracking> findByTripIdOrderByTimestampDesc(Long tripId);
}
