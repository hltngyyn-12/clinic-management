package com.clinic.backend.repository;

import com.clinic.backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByActiveTrueOrderByNameAsc();
}
