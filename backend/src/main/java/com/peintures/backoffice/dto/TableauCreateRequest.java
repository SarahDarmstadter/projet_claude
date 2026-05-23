package com.peintures.backoffice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record TableauCreateRequest(
        @NotBlank String titre,
        @NotNull BigDecimal largeur,
        @NotNull BigDecimal hauteur,
        Long typeId,
        @NotBlank String periode,
        BigDecimal prix,
        String description,
        @NotNull String statut,
        boolean visible,
        int ordre
) {}
