package com.neurofleetx.service;

import com.neurofleetx.model.DriverEarning;
import com.neurofleetx.repository.DriverEarningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverEarningService {

    private final DriverEarningRepository driverEarningRepository;

    public List<DriverEarning> getAllEarnings() {
        return driverEarningRepository.findAll();
    }

    public List<DriverEarning> getEarningsByDriverId(Long driverId) {
        return driverEarningRepository.findByDriverId(driverId);
    }
}
