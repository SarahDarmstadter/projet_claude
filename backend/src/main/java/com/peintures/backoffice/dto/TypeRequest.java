package com.peintures.backoffice.dto;

import jakarta.validation.constraints.NotBlank;

public record TypeRequest(@NotBlank String nom) {}
