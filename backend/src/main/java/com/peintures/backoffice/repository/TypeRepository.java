package com.peintures.backoffice.repository;

import com.peintures.backoffice.model.Type;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeRepository extends JpaRepository<Type, Long> {
    boolean existsByNom(String nom);
}
