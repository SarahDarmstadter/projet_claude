package com.peintures.backoffice.service;

import com.peintures.backoffice.model.AdminUser;
import com.peintures.backoffice.model.MfaCode;
import com.peintures.backoffice.repository.MfaCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class MfaService {

    private final MfaCodeRepository mfaCodeRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.mfa.code-length:6}")
    private int codeLength;

    @Value("${app.mfa.expiry-minutes:10}")
    private int expiryMinutes;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    public void sendCode(AdminUser user) {
        String plainCode = generateCode();
        MfaCode mfaCode = new MfaCode();
        mfaCode.setUser(user);
        mfaCode.setCodeHash(passwordEncoder.encode(plainCode));
        mfaCode.setExpiresAt(Instant.now().plus(expiryMinutes, ChronoUnit.MINUTES));
        mfaCodeRepository.save(mfaCode);

        if (user.getMfaMethod() == AdminUser.MfaMethod.EMAIL) {
            sendByEmail(user.getEmail(), plainCode);
        }
        // SMS : à brancher sur Twilio ici si user.getMfaMethod() == SMS
    }

    @Transactional
    public boolean verifyCode(AdminUser user, String submittedCode) {
        return mfaCodeRepository
                .findTopByUserAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(user, Instant.now())
                .map(code -> {
                    if (!passwordEncoder.matches(submittedCode, code.getCodeHash())) {
                        return false;
                    }
                    code.setUsed(true);
                    mfaCodeRepository.save(code);
                    return true;
                })
                .orElse(false);
    }

    private String generateCode() {
        int max = (int) Math.pow(10, codeLength);
        return String.format("%0" + codeLength + "d", random.nextInt(max));
    }

    private void sendByEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Votre code de vérification — Back Office Peintures");
        message.setText("Votre code : " + code + "\n\nCe code expire dans " + expiryMinutes + " minutes.");
        mailSender.send(message);
    }
}
