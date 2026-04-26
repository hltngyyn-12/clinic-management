package com.clinic.backend.repository;

import com.clinic.backend.entity.SlotConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SlotConfigRepository extends JpaRepository<SlotConfig, Long> {
    List<SlotConfig> findAllByOrderByIdDesc();
}
