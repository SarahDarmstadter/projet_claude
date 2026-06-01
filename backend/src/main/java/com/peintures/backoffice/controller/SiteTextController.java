package com.peintures.backoffice.controller;

import com.peintures.backoffice.model.SiteText;
import com.peintures.backoffice.repository.SiteTextRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class SiteTextController {

    private final SiteTextRepository repo;

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
        // Retourne l'état réellement persisté, pas l'input
        return existing.stream()
                .collect(Collectors.toMap(SiteText::getCle, SiteText::getValeur));
    }
}
