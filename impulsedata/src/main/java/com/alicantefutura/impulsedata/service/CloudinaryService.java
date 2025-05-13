package com.alicantefutura.impulsedata.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alicantefutura.impulsedata.dto.CloudinaryImageDTO;
import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;

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
            
            return processApiResponse(response);
            
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener imágenes de Cloudinary: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obtiene imágenes de una carpeta específica en Cloudinary
     * 
     * @param folder nombre de la carpeta
     * @param maxResults máximo número de resultados a retornar
     * @return lista de imágenes
     */
    public List<CloudinaryImageDTO> getImagesByFolder(String folder, int maxResults) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("type", "upload");
            params.put("max_results", maxResults);
            params.put("resource_type", "image");
            params.put("prefix", folder + "/");
            
            ApiResponse response = cloudinary.api().resources(params);
            
            return processApiResponse(response);
            
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener imágenes de la carpeta " + folder + ": " + e.getMessage(), e);
        }
    }
    
    /**
     * Procesa la respuesta de la API de Cloudinary y la convierte en DTOs
     * 
     * @param response respuesta de la API
     * @return lista de DTOs de imágenes
     */
    private List<CloudinaryImageDTO> processApiResponse(ApiResponse response) {
        List<CloudinaryImageDTO> images = new ArrayList<>();
        
        if (response.containsKey("resources")) {
            List<Map<String, Object>> resources = (List<Map<String, Object>>) response.get("resources");
            
            for (Map<String, Object> resource : resources) {
                CloudinaryImageDTO imageDTO = new CloudinaryImageDTO();
                
                imageDTO.setPublicId((String) resource.get("public_id"));
                imageDTO.setAlt((String) resource.get("public_id"));
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
                
                images.add(imageDTO);
            }
        }
        
        return images;
    }
} 