package com.neurofleetx.service;

import com.neurofleetx.model.LiveTracking;
import com.neurofleetx.repository.LiveTrackingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LiveTrackingService {

    private final LiveTrackingRepository liveTrackingRepository;

    public List<LiveTracking> getTrackingByTripId(Long tripId) {
        return liveTrackingRepository.findByTripIdOrderByTimestampDesc(tripId);
    }
}
