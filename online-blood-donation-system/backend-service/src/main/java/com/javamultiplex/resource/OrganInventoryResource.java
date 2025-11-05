package com.javamultiplex.resource;

import com.javamultiplex.model.OrganDetailDTO;
import com.javamultiplex.model.OrganInventoryDTO;
import com.javamultiplex.service.OrganInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/organs")
@CrossOrigin(origins = "*")
public class OrganInventoryResource {

    private final OrganInventoryService organInventoryService;

    @Autowired
    public OrganInventoryResource(OrganInventoryService organInventoryService) {
        this.organInventoryService = organInventoryService;
    }

    @GetMapping("/inventory")
    public ResponseEntity<Map<String, OrganInventoryDTO>> getOrganInventory() {
        Map<String, OrganInventoryDTO> inventory = organInventoryService.getOrganInventory();
        return new ResponseEntity<>(inventory, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<OrganDetailDTO>> searchOrgans(
            @RequestParam(required = false) String organType,
            @RequestParam(required = false) String pincode,
            @RequestParam(required = false) String city) {
        List<OrganDetailDTO> organs = organInventoryService.searchOrgans(organType, pincode, city);
        return new ResponseEntity<>(organs, HttpStatus.OK);
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<OrganDetailDTO>> getHospitalOrgans(@PathVariable Long hospitalId) {
        List<OrganDetailDTO> organs = organInventoryService.getOrgansByHospital(hospitalId);
        return new ResponseEntity<>(organs, HttpStatus.OK);
    }
}
