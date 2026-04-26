package com.clinic.backend.repository;

import com.clinic.backend.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {
    boolean existsByNameIgnoreCase(String name);

    List<Specialty> findAllByOrderByNameAsc();
}
