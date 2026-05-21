package com.peintures.backoffice.repository;

import com.peintures.backoffice.model.AdminUser;
import com.peintures.backoffice.model.MfaCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.Optional;

public interface MfaCodeRepository extends JpaRepository<MfaCode, Long> {

    Optional<MfaCode> findTopByUserAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            AdminUser user, Instant now);

    @Modifying
    @Query("DELETE FROM MfaCode c WHERE c.expiresAt < :cutoff")
    void deleteExpired(Instant cutoff);
}
