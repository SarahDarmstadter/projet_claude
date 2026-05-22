package com.peintures.backoffice.repository;

import com.peintures.backoffice.model.RevokedAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;

public interface RevokedAccessTokenRepository extends JpaRepository<RevokedAccessToken, String> {
    @Modifying
    @Query("DELETE FROM RevokedAccessToken t WHERE t.expiresAt < :cutoff")
    void deleteExpired(Instant cutoff);
}
