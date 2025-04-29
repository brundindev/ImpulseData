package com.alicantefutura.impulsedata.controller;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/images")
@CrossOrigin // añade esto si accedes desde otro dominio o frontend en localhost
public class CloudinaryController {

    @Autowired
    private Cloudinary cloudinary;

    @GetMapping
    public List<String> getAllImages() {
        try {
            Map result = cloudinary.api().resources(ObjectUtils.asMap(
                "type", "upload",
                "max_results", 100
            ));

            List<Map<String, Object>> resources = (List<Map<String, Object>>) result.get("resources");

            List<String> urls = new ArrayList<>();
            for (Map<String, Object> res : resources) {
                urls.add((String) res.get("secure_url"));
            }
            return urls;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
