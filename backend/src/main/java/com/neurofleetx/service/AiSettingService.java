package com.neurofleetx.service;

import com.neurofleetx.model.AiSetting;
import com.neurofleetx.repository.AiSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiSettingService {

    private final AiSettingRepository aiSettingRepository;

    public AiSetting getSettings() {
        return aiSettingRepository.findAll().stream().findFirst().orElseGet(() ->
                aiSettingRepository.save(AiSetting.builder()
                        .etaAccuracy(0.92)
                        .trafficWeight(0.45)
                        .energyEfficiencyWeight(0.35)
                        .build())
        );
    }

    public AiSetting updateSettings(AiSetting request) {
        AiSetting existing = getSettings();
        existing.setEtaAccuracy(request.getEtaAccuracy());
        existing.setTrafficWeight(request.getTrafficWeight());
        existing.setEnergyEfficiencyWeight(request.getEnergyEfficiencyWeight());
        return aiSettingRepository.save(existing);
    }
}
