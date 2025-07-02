package com.uumevent.dto;

import lombok.Data;

@Data
public class JwtAuthenticationResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserDto user;

    public JwtAuthenticationResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }
}