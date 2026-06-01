package com.peintures.backoffice.controller;

import com.peintures.backoffice.dto.ContactRequest;
import com.peintures.backoffice.repository.SiteTextRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ContactController {

    private final JavaMailSender mailSender;
    private final SiteTextRepository siteTextRepo;

    @PostMapping("/api/public/contact")
    public ResponseEntity<Void> contact(@Valid @RequestBody ContactRequest req) {
        String artisteEmail = siteTextRepo.findById("contact.email")
                .map(t -> t.getValeur())
                .filter(v -> !v.isBlank())
                .orElse("pierre.darmstadter@gmail.com");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(artisteEmail);
        message.setReplyTo(req.email().replaceAll("[\r\n]", ""));
        message.setSubject("[Contact] " + (req.sujet() != null && !req.sujet().isBlank()
                ? req.sujet() : "Message depuis le site"));
        message.setText(
                "De : " + req.prenom() + " " + req.nom() + " <" + req.email() + ">\n\n"
                + req.message()
        );
        try {
            mailSender.send(message);
        } catch (MailException e) {
            log.error("Échec envoi email contact", e);
            return ResponseEntity.status(503).build();
        }
        return ResponseEntity.ok().build();
    }
}
