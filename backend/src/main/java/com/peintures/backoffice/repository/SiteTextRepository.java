package com.peintures.backoffice.repository;

import com.peintures.backoffice.model.SiteText;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteTextRepository extends JpaRepository<SiteText, String> {
}
