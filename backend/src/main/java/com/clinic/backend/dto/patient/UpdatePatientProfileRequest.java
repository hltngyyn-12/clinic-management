package com.clinic.backend.dto.patient;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdatePatientProfileRequest {

    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
    private String fullName;

    @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
    private String phone;

    private String dateOfBirth;

    @Size(max = 50, message = "Giới tính không được vượt quá 50 ký tự")
    private String gender;

    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
    private String address;

    @Size(max = 255, message = "Số bảo hiểm y tế không được vượt quá 255 ký tự")
    private String insuranceNumber;
}
