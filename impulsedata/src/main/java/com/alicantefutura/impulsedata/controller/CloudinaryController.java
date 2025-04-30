package com.alicantefutura.impulsedata.controller;

import com.alicantefutura.impulsedata.dto.CloudinaryImageDTO;
import com.alicantefutura.impulsedata.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cloudinary")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://impulsedata.es"})
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    @Autowired
    public CloudinaryController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    /**
     * Obtiene todas las imágenes disponibles en Cloudinary
     * 
     * @param maxResults máximo número de resultados a retornar (opcional, por defecto 100)
     * @return lista de imágenes
     */
    @GetMapping("/images")
    public ResponseEntity<List<CloudinaryImageDTO>> getAllImages(
            @RequestParam(value = "maxResults", defaultValue = "100") int maxResults) {
        
        List<CloudinaryImageDTO> images = cloudinaryService.getAllImages(maxResults);
        return ResponseEntity.ok(images);
    }
} 