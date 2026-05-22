package com.peintures.backoffice.service;

import com.peintures.backoffice.model.AdminUser;
import com.peintures.backoffice.model.RefreshToken;
import com.peintures.backoffice.model.RevokedAccessToken;
import com.peintures.backoffice.repository.AdminUserRepository;
import com.peintures.backoffice.repository.RefreshTokenRepository;
import com.peintures.backoffice.repository.RevokedAccessTokenRepository;
import com.peintures.backoffice.security.JwtProvider;
import com.peintures.backoffice.util.TokenHashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RevokedAccessTokenRepository revokedAccessTokenRepository;
    private final MfaService mfaService;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.auth.max-failed-attempts:5}")
    private int maxFailedAttempts;

    @Value("${app.auth.lockout-duration-minutes:15}")
    private int lockoutMinutes;

    @Value("${app.jwt.refresh-token-expiry-ms:604800000}")
    private long refreshTokenExpiryMs;

    public enum Step1Result {
        MFA_SENT, ACCOUNT_LOCKED, INVALID_CREDENTIALS
    }

    // Fix 4 — lock check BEFORE BCrypt
    @Transactional
    public Step1Result initiateLogin(String email, String password) {
        AdminUser user = adminUserRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return Step1Result.INVALID_CREDENTIALS;
        }
        if (user.isLocked()) {
            return Step1Result.ACCOUNT_LOCKED;
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            recordFailedAttempt(user);
            return Step1Result.INVALID_CREDENTIALS;
        }

        user.setFailedAttempts(0);
        adminUserRepository.save(user);
        mfaService.sendCode(user);
        return Step1Result.MFA_SENT;
    }

    public record TokenPair(String accessToken, String refreshToken) {}

    // Fix 3 — rate limiting on MFA failures; Fix 1 — SHA-256 for refresh token hash; Fix 8 — orElse(null)
    @Transactional
    public TokenPair completeMfaLogin(String email, String code) {
        AdminUser user = adminUserRepository.findByEmail(email).orElse(null);
        if (user == null || user.isLocked()) {
            return null;
        }

        if (!mfaService.verifyCode(user, code)) {
            recordFailedAttempt(user);
            return null;
        }

        user.setFailedAttempts(0);
        adminUserRepository.save(user);

        String accessToken = jwtProvider.generateAccessToken(email);
        String plainRefresh = UUID.randomUUID().toString();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(TokenHashUtil.sha256(plainRefresh));
        refreshToken.setExpiresAt(Instant.now().plusMillis(refreshTokenExpiryMs));
        refreshTokenRepository.save(refreshToken);

        return new TokenPair(accessToken, plainRefresh);
    }

    // Fix 2 — O(1) lookup via findByTokenHash instead of findAll() stream
    @Transactional
    public String refreshAccessToken(String plainRefreshToken) {
        return refreshTokenRepository.findByTokenHash(TokenHashUtil.sha256(plainRefreshToken))
                .filter(t -> !t.isRevoked() && !t.isExpired())
                .map(t -> jwtProvider.generateAccessToken(t.getUser().getEmail()))
                .orElse(null);
    }

    // Fix 5 — revoke access token JTI on logout
    @Transactional
    public void logout(String email, String accessToken) {
        adminUserRepository.findByEmail(email)
                .ifPresent(refreshTokenRepository::revokeAllForUser);

        if (accessToken != null && jwtProvider.isValid(accessToken)) {
            RevokedAccessToken revoked = new RevokedAccessToken();
            revoked.setJti(jwtProvider.extractJti(accessToken));
            revoked.setExpiresAt(jwtProvider.extractExpiration(accessToken).toInstant());
            revokedAccessTokenRepository.save(revoked);
        }
    }

    private void recordFailedAttempt(AdminUser user) {
        user.setFailedAttempts(user.getFailedAttempts() + 1);
        if (user.getFailedAttempts() >= maxFailedAttempts) {
            user.setLockedUntil(Instant.now().plus(lockoutMinutes, ChronoUnit.MINUTES));
        }
        adminUserRepository.save(user);
    }
}
