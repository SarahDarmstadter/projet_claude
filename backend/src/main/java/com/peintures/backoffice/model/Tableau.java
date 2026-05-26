package com.peintures.backoffice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "tableaux")
@Getter
@Setter
@NoArgsConstructor
public class Tableau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_path", nullable = false, length = 255)
    private String imagePath;

    @Column(nullable = false, length = 255)
    private String titre;

    @Column(nullable = false, precision = 7, scale = 2)
    private BigDecimal largeur;

    @Column(nullable = false, precision = 7, scale = 2)
    private BigDecimal hauteur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id")
    private Type type;

    @Column(nullable = false, length = 50)
    private String periode;

    @Column(precision = 10, scale = 2)
    private BigDecimal prix;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Statut statut = Statut.disponible;

    @Column(nullable = false)
    private boolean visible = true;

    @Column(nullable = false)
    private int ordre = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum Statut {
        disponible, vendu, non_a_vendre
    }
}
