package com.peintures.backoffice.repository;

import com.peintures.backoffice.model.Tableau;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TableauRepository extends JpaRepository<Tableau, Long> {
    List<Tableau> findAllByOrderByOrdreAsc();
    List<Tableau> findByVisibleTrueOrderByOrdreAsc();
    boolean existsByTypeId(Long typeId);
}
