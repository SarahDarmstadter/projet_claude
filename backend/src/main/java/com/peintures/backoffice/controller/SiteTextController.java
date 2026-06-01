package com.peintures.backoffice.controller;

import com.peintures.backoffice.model.SiteText;
import com.peintures.backoffice.repository.SiteTextRepository;
import com.peintures.backoffice.service.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class SiteTextController {

    private final SiteTextRepository repo;
    private final MinioService minioService;

    @GetMapping("/api/public/textes")
    public Map<String, String> getAll() {
        return repo.findAll().stream()
                .collect(Collectors.toMap(SiteText::getCle, SiteText::getValeur));
    }

    @Transactional
    @PutMapping("/api/admin/textes")
    public Map<String, String> updateAll(@RequestBody Map<String, String> updates) {
        List<SiteText> existing = repo.findAllById(updates.keySet());
        existing.forEach(t -> t.setValeur(updates.get(t.getCle())));
        repo.saveAll(existing);
        return existing.stream()
                .collect(Collectors.toMap(SiteText::getCle, SiteText::getValeur));
    }

    @PostMapping("/api/admin/photo-artiste")
    public Map<String, String> uploadPhoto(@RequestParam("image") MultipartFile image) {
        String url = minioService.upload(image);
        try {
            SiteText text = repo.findById("site.artiste.photo").orElseGet(() -> {
                SiteText t = new SiteText();
                t.setCle("site.artiste.photo");
                return t;
            });
            text.setValeur(url);
            repo.save(text);
        } catch (Exception e) {
            minioService.delete(url);
            throw e;
        }
        return Map.of("url", url);
    }
}
