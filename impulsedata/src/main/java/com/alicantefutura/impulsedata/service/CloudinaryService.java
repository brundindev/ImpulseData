package com.alicantefutura.impulsedata.service;

import com.alicantefutura.impulsedata.dto.CloudinaryImageDTO;
import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Obtiene todas las imágenes disponibles en Cloudinary
     * 
     * @param maxResults máximo número de resultados a retornar
     * @return lista de imágenes
     */
    public List<CloudinaryImageDTO> getAllImages(int maxResults) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("type", "upload");
            params.put("max_results", maxResults);
            params.put("resource_type", "image");
            
            ApiResponse response = cloudinary.api().resources(params);
            
            List<CloudinaryImageDTO> images = new ArrayList<>();
            
            if (response.containsKey("resources")) {
                List<Map<String, Object>> resources = (List<Map<String, Object>>) response.get("resources");
                
                for (Map<String, Object> resource : resources) {
                    CloudinaryImageDTO imageDTO = mapResourceToImageDTO(resource);
                    images.add(imageDTO);
                }
            }
            
            return images;
            
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener imágenes de Cloudinary: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obtiene imágenes de una carpeta específica en Cloudinary
     * 
     * @param folder nombre de la carpeta
     * @param maxResults máximo número de resultados a retornar
     * @return lista de imágenes en la carpeta
     */
    public List<CloudinaryImageDTO> getImagesByFolder(String folder, int maxResults) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("type", "upload");
            params.put("max_results", maxResults);
            params.put("resource_type", "image");
            params.put("prefix", folder);
            
            ApiResponse response = cloudinary.api().resources(params);
            
            List<CloudinaryImageDTO> images = new ArrayList<>();
            
            if (response.containsKey("resources")) {
                List<Map<String, Object>> resources = (List<Map<String, Object>>) response.get("resources");
                
                for (Map<String, Object> resource : resources) {
                    CloudinaryImageDTO imageDTO = mapResourceToImageDTO(resource);
                    images.add(imageDTO);
                }
            }
            
            return images;
            
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener imágenes de carpeta " + folder + ": " + e.getMessage(), e);
        }
    }
    
    /**
     * Convierte un recurso de Cloudinary a un DTO de imagen
     * 
     * @param resource mapa con los datos del recurso
     * @return DTO de imagen
     */
    private CloudinaryImageDTO mapResourceToImageDTO(Map<String, Object> resource) {
        CloudinaryImageDTO imageDTO = new CloudinaryImageDTO();
        
        imageDTO.setPublicId((String) resource.get("public_id"));
        imageDTO.setAlt(formatPublicIdToAlt((String) resource.get("public_id")));
        imageDTO.setUrl((String) resource.get("url"));
        imageDTO.setSecureUrl((String) resource.get("secure_url"));
        imageDTO.setFormat((String) resource.get("format"));
        
        if (resource.get("width") != null) {
            imageDTO.setWidth(((Number) resource.get("width")).intValue());
        }
        
        if (resource.get("height") != null) {
            imageDTO.setHeight(((Number) resource.get("height")).intValue());
        }
        
        if (resource.get("bytes") != null) {
            imageDTO.setBytes(((Number) resource.get("bytes")).intValue());
        }
        
        imageDTO.setResourceType((String) resource.get("resource_type"));
        imageDTO.setCreatedAt((String) resource.get("created_at"));
        
        return imageDTO;
    }
    
    /**
     * Formatea un ID público para usarlo como texto alternativo
     * 
     * @param publicId ID público
     * @return texto formateado
     */
    private String formatPublicIdToAlt(String publicId) {
        if (publicId == null || publicId.isEmpty()) {
            return "Imagen";
        }
        
        // Extraer el nombre del archivo sin la ruta
        String fileName = publicId;
        if (publicId.contains("/")) {
            fileName = publicId.substring(publicId.lastIndexOf('/') + 1);
        }
        
        // Reemplazar guiones y guiones bajos por espacios
        String formatted = fileName
                .replace("-", " ")
                .replace("_", " ");
        
        // Eliminar extensión si existe
        if (formatted.contains(".")) {
            formatted = formatted.substring(0, formatted.lastIndexOf('.'));
        }
        
        // Capitalizar primera letra si es posible
        if (!formatted.isEmpty()) {
            formatted = formatted.substring(0, 1).toUpperCase() + formatted.substring(1);
        }
        
        return formatted;
    }
} 