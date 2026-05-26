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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TableauService {

    private final TableauRepository tableauRepository;
    private final TypeRepository typeRepository;

    @Value("${app.upload-dir:/uploads}")
    private String uploadDir;

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
        String imagePath = saveImage(image);
        Tableau tableau = buildTableau(new Tableau(), req, imagePath);
        return toResponse(tableauRepository.save(tableau));
    }

    @Transactional
    public TableauResponse update(Long id, MultipartFile image, TableauCreateRequest req) {
        Tableau tableau = tableauRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tableau not found: " + id));

        String imagePath;
        if (image != null && !image.isEmpty()) {
            deleteImageFile(tableau.getImagePath());
            imagePath = saveImage(image);
        } else {
            imagePath = tableau.getImagePath();
        }

        buildTableau(tableau, req, imagePath);
        return toResponse(tableauRepository.save(tableau));
    }

    @Transactional
    public void delete(Long id) {
        Tableau tableau = tableauRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tableau not found: " + id));
        deleteImageFile(tableau.getImagePath());
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

    private String saveImage(MultipartFile image) {
        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);

            String originalFilename = image.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            }
            String filename = UUID.randomUUID() + extension;
            Files.copy(image.getInputStream(), dir.resolve(filename));
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to store image", e);
        }
    }

    private void deleteImageFile(String imagePath) {
        if (imagePath == null || imagePath.isBlank()) {
            return;
        }
        try {
            // imagePath is e.g. "/uploads/uuid.jpg" — strip the leading "/uploads/"
            String filename = imagePath.replaceFirst("^/uploads/", "");
            Path file = Paths.get(uploadDir, filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            // log but do not abort the transaction
        }
    }

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
