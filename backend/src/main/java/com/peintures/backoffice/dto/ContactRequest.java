package com.peintures.backoffice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank @Size(max = 100) String prenom,
        @NotBlank @Size(max = 100) String nom,
        @NotBlank @Email @Size(max = 254) String email,
        @Size(max = 200) String sujet,
        @NotBlank @Size(max = 2000) String message
) {}
