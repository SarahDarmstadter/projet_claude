package com.peintures.backoffice.service;

import com.peintures.backoffice.dto.OrderItem;
import com.peintures.backoffice.dto.TableauCreateRequest;
import com.peintures.backoffice.dto.TableauResponse;
import com.peintures.backoffice.dto.TypeDto;
import com.peintures.backoffice.exception.ResourceNotFoundException;
import com.peintures.backoffice.model.Tableau;
import com.peintures.backoffice.model.Type;
import com.peintures.backoffice.repository.TableauRepository;
import com.peintures.backoffice.repository.TypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableauService {

    private final TableauRepository tableauRepository;
    private final TypeRepository typeRepository;
    private final MinioService minioService;

    public List<TableauResponse> findAll() {
        return tableauRepository.findAllByOrderByOrdreAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TableauResponse> findPublic() {
        return tableauRepository.findByVisibleTrueOrderByOrdreAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public TableauResponse findById(Long id) {
        return tableauRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Tableau not found: " + id));
    }

    @Transactional
    public TableauResponse create(MultipartFile image, TableauCreateRequest req) {
        String imageUrl = minioService.upload(image);
        try {
            Tableau tableau = buildTableau(new Tableau(), req, imageUrl);
            return toResponse(tableauRepository.save(tableau));
        } catch (Exception e) {
            minioService.delete(imageUrl);
            throw e;
        }
    }

    @Transactional
    public TableauResponse update(Long id, MultipartFile image, TableauCreateRequest req) {
        Tableau tableau = tableauRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tableau not found: " + id));

        String imageUrl;
        if (image != null && !image.isEmpty()) {
            // Upload d'abord : si ça échoue, l'ancien fichier est préservé
            String newImageUrl = minioService.upload(image);
            minioService.delete(tableau.getImagePath());
            imageUrl = newImageUrl;
        } else {
            imageUrl = tableau.getImagePath();
        }

        buildTableau(tableau, req, imageUrl);
        return toResponse(tableauRepository.save(tableau));
    }

    @Transactional
    public void delete(Long id) {
        Tableau tableau = tableauRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tableau not found: " + id));
        minioService.delete(tableau.getImagePath());
        tableauRepository.delete(tableau);
    }

    @Transactional
    public void updateOrder(List<OrderItem> items) {
        List<Tableau> toSave = items.stream().map(item -> {
            Tableau tableau = tableauRepository.findById(item.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Tableau not found: " + item.id()));
            tableau.setOrdre(item.ordre());
            return tableau;
        }).toList();
        tableauRepository.saveAll(toSave);
    }

    // --- helpers ---

    private Tableau buildTableau(Tableau tableau, TableauCreateRequest req, String imagePath) {
        tableau.setImagePath(imagePath);
        tableau.setTitre(req.titre());
        tableau.setLargeur(req.largeur());
        tableau.setHauteur(req.hauteur());
        tableau.setPeriode(req.periode());
        tableau.setPrix(req.prix());
        tableau.setDescription(req.description());
        tableau.setStatut(Tableau.Statut.valueOf(req.statut()));
        tableau.setVisible(req.visible());
        tableau.setOrdre(req.ordre());

        if (req.typeId() != null) {
            Type type = typeRepository.findById(req.typeId()).orElse(null);
            tableau.setType(type);
        } else {
            tableau.setType(null);
        }

        return tableau;
    }

    private TableauResponse toResponse(Tableau t) {
        TypeDto typeDto = t.getType() != null
                ? new TypeDto(t.getType().getId(), t.getType().getNom())
                : null;

        return new TableauResponse(
                t.getId(),
                t.getImagePath(),
                t.getTitre(),
                t.getLargeur(),
                t.getHauteur(),
                typeDto,
                t.getPeriode(),
                t.getPrix(),
                t.getDescription(),
                t.getStatut().name(),
                t.isVisible(),
                t.getOrdre()
        );
    }
}
