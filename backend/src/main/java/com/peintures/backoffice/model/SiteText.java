package com.peintures.backoffice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "site_texts")
@Getter
@Setter
@NoArgsConstructor
public class SiteText {

    @Id
    @Column(length = 100)
    private String cle;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String valeur;
}
