package com.neurofleetx.repository;

import com.neurofleetx.model.AiSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiSettingRepository extends JpaRepository<AiSetting, Long> {
}
