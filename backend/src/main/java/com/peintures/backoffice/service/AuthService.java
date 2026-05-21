package com.peintures.backoffice.service;

import com.peintures.backoffice.model.AdminUser;
import com.peintures.backoffice.model.RefreshToken;
import com.peintures.backoffice.repository.AdminUserRepository;
import com.peintures.backoffice.repository.RefreshTokenRepository;
import com.peintures.backoffice.security.JwtProvider;
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

    @Transactional
    public Step1Result initiateLogin(String email, String password) {
        AdminUser user = adminUserRepository.findByEmail(email).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            if (user != null) {
                recordFailedAttempt(user);
            }
            return Step1Result.INVALID_CREDENTIALS;
        }

        if (user.isLocked()) {
            return Step1Result.ACCOUNT_LOCKED;
        }

        user.setFailedAttempts(0);
        adminUserRepository.save(user);
        mfaService.sendCode(user);
        return Step1Result.MFA_SENT;
    }

    public record TokenPair(String accessToken, String refreshToken) {}

    @Transactional
    public TokenPair completeMfaLogin(String email, String code) {
        AdminUser user = adminUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        if (!mfaService.verifyCode(user, code)) {
            return null;
        }

        String accessToken = jwtProvider.generateAccessToken(email);
        String plainRefresh = UUID.randomUUID().toString();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(passwordEncoder.encode(plainRefresh));
        refreshToken.setExpiresAt(Instant.now().plusMillis(refreshTokenExpiryMs));
        refreshTokenRepository.save(refreshToken);

        return new TokenPair(accessToken, plainRefresh);
    }

    @Transactional
    public String refreshAccessToken(String plainRefreshToken) {
        return refreshTokenRepository.findAll().stream()
                .filter(t -> !t.isRevoked() && !t.isExpired())
                .filter(t -> passwordEncoder.matches(plainRefreshToken, t.getTokenHash()))
                .findFirst()
                .map(t -> jwtProvider.generateAccessToken(t.getUser().getEmail()))
                .orElse(null);
    }

    @Transactional
    public void logout(String email) {
        adminUserRepository.findByEmail(email)
                .ifPresent(refreshTokenRepository::revokeAllForUser);
    }

    private void recordFailedAttempt(AdminUser user) {
        user.setFailedAttempts(user.getFailedAttempts() + 1);
        if (user.getFailedAttempts() >= maxFailedAttempts) {
            user.setLockedUntil(Instant.now().plus(lockoutMinutes, ChronoUnit.MINUTES));
        }
        adminUserRepository.save(user);
    }
}
