package com.peintures.backoffice.dto;

import java.math.BigDecimal;

public record TableauResponse(
        Long id,
        String imageUrl,
        String titre,
        BigDecimal largeur,
        BigDecimal hauteur,
        TypeDto type,
        String periode,
        BigDecimal prix,
        String description,
        String statut,
        boolean visible,
        int ordre
) {}
