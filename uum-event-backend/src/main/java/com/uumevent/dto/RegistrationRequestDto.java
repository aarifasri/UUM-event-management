package com.uumevent.dto;

import lombok.Data;

@Data
public class RegistrationRequestDto {
    private String name;
    private String email;
    private String phone;
    private String specialRequests;
}