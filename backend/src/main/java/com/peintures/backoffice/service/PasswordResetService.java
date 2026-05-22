package com.peintures.backoffice.service;

import com.peintures.backoffice.model.AdminUser;
import com.peintures.backoffice.model.PasswordResetToken;
import com.peintures.backoffice.repository.AdminUserRepository;
import com.peintures.backoffice.repository.PasswordResetTokenRepository;
import com.peintures.backoffice.util.TokenHashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.password-reset.token-expiry-hours:1}")
    private int tokenExpiryHours;

    @Value("${app.password-reset.base-url}")
    private String baseUrl;

    @Transactional
    public void initiateReset(String email) {
        // Réponse identique que l'email existe ou non (anti-énumération)
        adminUserRepository.findByEmail(email).ifPresent(user -> {
            String plainToken = UUID.randomUUID().toString();
            PasswordResetToken token = new PasswordResetToken();
            token.setUser(user);
            token.setTokenHash(TokenHashUtil.sha256(plainToken));
            token.setExpiresAt(Instant.now().plus(tokenExpiryHours, ChronoUnit.HOURS));
            tokenRepository.save(token);
            sendResetEmail(email, plainToken);
        });
    }

    @Transactional
    public boolean resetPassword(String plainToken, String newPassword) {
        return tokenRepository.findByTokenHash(TokenHashUtil.sha256(plainToken))
                .filter(t -> !t.isUsed() && !t.isExpired())
                .map(t -> {
                    AdminUser user = t.getUser();
                    user.setPasswordHash(passwordEncoder.encode(newPassword));
                    adminUserRepository.save(user);
                    t.setUsed(true);
                    tokenRepository.save(t);
                    return true;
                })
                .orElse(false);
    }

    private void sendResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Réinitialisation de votre mot de passe — Back Office Peintures");
        message.setText(
                "Cliquez sur ce lien pour réinitialiser votre mot de passe :\n\n"
                + baseUrl + "/#/reset-password?token=" + token
                + "\n\nCe lien expire dans " + tokenExpiryHours + " heure(s)."
        );
        mailSender.send(message);
    }
}
