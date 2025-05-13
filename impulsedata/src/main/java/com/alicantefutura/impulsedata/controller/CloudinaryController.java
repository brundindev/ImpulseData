package com.alicantefutura.impulsedata.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alicantefutura.impulsedata.dto.CloudinaryImageDTO;
import com.alicantefutura.impulsedata.service.CloudinaryService;

@RestController
@RequestMapping("/api/cloudinary")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://impulsedata.es", "https://impulsedata.vercel.app", "https://impulsedata.onrender.com"})
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    @Autowired
    public CloudinaryController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    /**
     * Obtiene todas las imágenes disponibles en Cloudinary
     * Este endpoint es público y no requiere autenticación
     * 
     * @param maxResults máximo número de resultados a retornar (opcional, por defecto 100)
     * @param folder carpeta específica para filtrar (opcional)
     * @return lista de imágenes
     */
    @GetMapping("/images")
    public ResponseEntity<List<CloudinaryImageDTO>> getAllImages(
            @RequestParam(value = "maxResults", defaultValue = "100") int maxResults,
            @RequestParam(value = "folder", required = false) String folder) {
        
        try {
            List<CloudinaryImageDTO> images;
            
            if (folder != null && !folder.isEmpty()) {
                images = cloudinaryService.getImagesByFolder(folder, maxResults);
            } else {
                images = cloudinaryService.getAllImages(maxResults);
            }
            
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            // Loguear el error
            System.err.println("Error al obtener imágenes: " + e.getMessage());
            e.printStackTrace();
            
            // Devolver una lista vacía en caso de error
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Endpoint de salud para verificar que el backend está disponible
     * Este endpoint es público y no requiere autenticación
     * 
     * @return 200 OK si todo está correcto
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "cloudinary");
        response.put("timestamp", new java.util.Date().toString());
        return ResponseEntity.ok(response);
    }
} 