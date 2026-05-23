package com.peintures.backoffice.controller;

import com.peintures.backoffice.dto.TypeDto;
import com.peintures.backoffice.dto.TypeRequest;
import com.peintures.backoffice.exception.TypeInUseException;
import com.peintures.backoffice.service.TypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/types")
@RequiredArgsConstructor
public class TypeController {

    private final TypeService typeService;

    @GetMapping
    public List<TypeDto> list() {
        return typeService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TypeDto create(@Valid @RequestBody TypeRequest req) {
        return typeService.create(req);
    }

    @PutMapping("/{id}")
    public TypeDto update(@PathVariable Long id, @Valid @RequestBody TypeRequest req) {
        return typeService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            typeService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (TypeInUseException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
