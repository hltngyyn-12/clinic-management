package com.clinic.backend.controller;

import com.clinic.backend.dto.admin.*;
import com.clinic.backend.dto.common.ApiResponse;
import com.clinic.backend.service.AdminPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminPortalService adminPortalService;

    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctors fetched successfully", adminPortalService.getDoctors()));
    }

    @GetMapping("/doctors/{doctorId}")
    public ResponseEntity<?> getDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor fetched successfully", adminPortalService.getDoctor(doctorId)));
    }

    @PostMapping("/doctors")
    public ResponseEntity<?> createDoctor(@RequestBody AdminDoctorRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor created successfully", adminPortalService.createDoctor(request)));
    }

    @PutMapping("/doctors/{doctorId}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long doctorId, @RequestBody AdminDoctorRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor updated successfully", adminPortalService.updateDoctor(doctorId, request)));
    }

    @DeleteMapping("/doctors/{doctorId}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long doctorId) {
        adminPortalService.deleteDoctor(doctorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor deleted successfully", null));
    }

    @GetMapping("/specialties")
    public ResponseEntity<?> getSpecialties() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Specialties fetched successfully", adminPortalService.getSpecialties()));
    }

    @PostMapping("/specialties")
    public ResponseEntity<?> createSpecialty(@RequestBody SpecialtyRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Specialty created successfully", adminPortalService.createSpecialty(request)));
    }

    @PutMapping("/specialties/{specialtyId}")
    public ResponseEntity<?> updateSpecialty(@PathVariable Long specialtyId, @RequestBody SpecialtyRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Specialty updated successfully", adminPortalService.updateSpecialty(specialtyId, request)));
    }

    @DeleteMapping("/specialties/{specialtyId}")
    public ResponseEntity<?> deleteSpecialty(@PathVariable Long specialtyId) {
        adminPortalService.deleteSpecialty(specialtyId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Specialty deleted successfully", null));
    }

    @GetMapping("/medicines")
    public ResponseEntity<?> getMedicines() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Medicines fetched successfully", adminPortalService.getMedicines()));
    }

    @PostMapping("/medicines")
    public ResponseEntity<?> createMedicine(@RequestBody MedicineRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Medicine created successfully", adminPortalService.createMedicine(request)));
    }

    @PutMapping("/medicines/{medicineId}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long medicineId, @RequestBody MedicineRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Medicine updated successfully", adminPortalService.updateMedicine(medicineId, request)));
    }

    @DeleteMapping("/medicines/{medicineId}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long medicineId) {
        adminPortalService.deleteMedicine(medicineId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Medicine deleted successfully", null));
    }

    @GetMapping("/slot-configs")
    public ResponseEntity<?> getSlotConfigs() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Slot configs fetched successfully", adminPortalService.getSlotConfigs()));
    }

    @PostMapping("/slot-configs")
    public ResponseEntity<?> createSlotConfig(@RequestBody SlotConfigRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Slot config created successfully", adminPortalService.createSlotConfig(request)));
    }

    @PutMapping("/slot-configs/{slotConfigId}")
    public ResponseEntity<?> updateSlotConfig(@PathVariable Long slotConfigId, @RequestBody SlotConfigRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Slot config updated successfully", adminPortalService.updateSlotConfig(slotConfigId, request)));
    }

    @DeleteMapping("/slot-configs/{slotConfigId}")
    public ResponseEntity<?> deleteSlotConfig(@PathVariable Long slotConfigId) {
        adminPortalService.deleteSlotConfig(slotConfigId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Slot config deleted successfully", null));
    }

    @GetMapping("/reports/revenue")
    public ResponseEntity<?> getRevenueReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Revenue report fetched successfully",
                adminPortalService.getRevenueReport(startDate, endDate)
        ));
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Notifications fetched successfully", adminPortalService.getNotifications()));
    }

    @PostMapping("/notifications")
    public ResponseEntity<?> createNotification(@RequestBody NotificationRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Notification created successfully", adminPortalService.createNotification(request)));
    }

    @PutMapping("/notifications/{notificationId}")
    public ResponseEntity<?> updateNotification(@PathVariable Long notificationId, @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Notification updated successfully", adminPortalService.updateNotification(notificationId, request)));
    }

    @DeleteMapping("/notifications/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId) {
        adminPortalService.deleteNotification(notificationId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Notification deleted successfully", null));
    }
}
