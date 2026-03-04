package com.neurofleetx.controller;

import com.neurofleetx.model.AiSetting;
import com.neurofleetx.service.AiSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/settings")
@RequiredArgsConstructor
public class AiSettingsController {

    private final AiSettingService aiSettingService;

    @GetMapping
    public AiSetting getSettings() {
        return aiSettingService.getSettings();
    }

    @PutMapping
    public AiSetting updateSettings(@RequestBody AiSetting request) {
        return aiSettingService.updateSettings(request);
    }
}
