package com.peintures.backoffice.service;

import com.peintures.backoffice.dto.TypeDto;
import com.peintures.backoffice.dto.TypeRequest;
import com.peintures.backoffice.exception.ResourceNotFoundException;
import com.peintures.backoffice.exception.TypeInUseException;
import com.peintures.backoffice.model.Type;
import com.peintures.backoffice.repository.TableauRepository;
import com.peintures.backoffice.repository.TypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TypeService {

    private final TypeRepository typeRepository;
    private final TableauRepository tableauRepository;

    public List<TypeDto> findAll() {
        return typeRepository.findAll().stream()
                .sorted(Comparator.comparing(Type::getNom))
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public TypeDto create(TypeRequest req) {
        Type type = new Type();
        type.setNom(req.nom());
        return toDto(typeRepository.save(type));
    }

    @Transactional
    public TypeDto update(Long id, TypeRequest req) {
        Type type = typeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type not found: " + id));
        type.setNom(req.nom());
        return toDto(typeRepository.save(type));
    }

    @Transactional
    public void delete(Long id) {
        if (tableauRepository.existsByTypeId(id)) {
            throw new TypeInUseException("Type " + id + " is referenced by one or more tableaux and cannot be deleted");
        }
        typeRepository.deleteById(id);
    }

    private TypeDto toDto(Type type) {
        return new TypeDto(type.getId(), type.getNom());
    }
}
