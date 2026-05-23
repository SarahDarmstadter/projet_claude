package com.peintures.backoffice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.peintures.backoffice.dto.OrderItem;
import com.peintures.backoffice.dto.TableauCreateRequest;
import com.peintures.backoffice.dto.TableauResponse;
import com.peintures.backoffice.service.TableauService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TableauController {

    private final TableauService tableauService;
    private final ObjectMapper objectMapper;

    // ---- Public endpoint ----

    @GetMapping("/api/public/tableaux")
    public List<TableauResponse> listPublic() {
        return tableauService.findPublic();
    }

    // ---- Admin endpoints ----

    @GetMapping("/api/admin/tableaux")
    public List<TableauResponse> listAll() {
        return tableauService.findAll();
    }

    @GetMapping("/api/admin/tableaux/{id}")
    public TableauResponse getById(@PathVariable Long id) {
        return tableauService.findById(id);
    }

    @PostMapping("/api/admin/tableaux")
    @ResponseStatus(HttpStatus.CREATED)
    public TableauResponse create(
            @RequestParam("image") MultipartFile image,
            @RequestParam("data") String data) throws IOException {
        TableauCreateRequest req = objectMapper.readValue(data, TableauCreateRequest.class);
        return tableauService.create(image, req);
    }

    @PutMapping("/api/admin/tableaux/{id}")
    public TableauResponse update(
            @PathVariable Long id,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("data") String data) throws IOException {
        TableauCreateRequest req = objectMapper.readValue(data, TableauCreateRequest.class);
        return tableauService.update(id, image, req);
    }

    @DeleteMapping("/api/admin/tableaux/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tableauService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/api/admin/tableaux/order")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateOrder(@RequestBody List<OrderItem> items) {
        tableauService.updateOrder(items);
    }
}
