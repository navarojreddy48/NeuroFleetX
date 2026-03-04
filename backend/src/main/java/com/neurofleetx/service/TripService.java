package com.neurofleetx.service;

import com.neurofleetx.model.Trip;
import com.neurofleetx.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip createTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    public List<Trip> getTripsByDriverId(Long driverId) {
        return tripRepository.findByDriverId(driverId);
    }
}
