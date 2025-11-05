package com.javamultiplex.resource;

import com.javamultiplex.entity.BloodDonor;
import com.javamultiplex.enums.BloodDonorStatus;
import com.javamultiplex.model.BloodDonorStatusDTO;
import com.javamultiplex.service.BloodDonorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class BloodDonorResource {

    private final BloodDonorService bloodDonorService;

    @Autowired
    public BloodDonorResource(BloodDonorService bloodDonorService) {
        this.bloodDonorService = bloodDonorService;
    }

    @PostMapping(value = "/donor", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BloodDonor> register(@RequestParam(name = "file") MultipartFile image,
                                               @RequestParam(name = "request") String bloodDonor) {
        return new ResponseEntity<>(bloodDonorService.register(bloodDonor, image), HttpStatus.CREATED);
    }

    @GetMapping(value = "/donors")
    public List<BloodDonor> findAll(@RequestParam(name = "zip", required = false) String zip,
                                    @RequestParam(name = "bloodGroup", required = false) String bloodGroup,
                                    @RequestParam(name = "organType", required = false) String organType,
                                    @RequestParam(name = "status", required = false) BloodDonorStatus status,
                                    @RequestParam(name = "allOrgans", required = false) Boolean allOrgans) {
        List<BloodDonor> bloodDonors;
        if (status != null) {
            bloodDonors = bloodDonorService.findAll(status);
        } else if (allOrgans != null && allOrgans) {
            // Return all active organ donors
            bloodDonors = bloodDonorService.getAllOrganDonors();
        } else if (organType != null && !organType.isEmpty()) {
            bloodDonors = bloodDonorService.searchByOrgan(zip, organType);
        } else if (bloodGroup != null && !bloodGroup.isEmpty()) {
            bloodDonors = bloodDonorService.search(zip, bloodGroup);
        } else if (zip != null && !zip.isEmpty()) {
            // If only zip is provided, search for all active donors in that zip
            bloodDonors = bloodDonorService.findAll(BloodDonorStatus.ACTIVE);
            // Filter by zip code
            bloodDonors = bloodDonors.stream()
                .filter(donor -> donor.getAddress() != null && 
                          donor.getAddress().getZip() != null && 
                          donor.getAddress().getZip().equals(zip))
                .collect(ArrayList::new, (list, item) -> list.add(item), (list1, list2) -> list1.addAll(list2));
        } else {
            // Return all active donors if no specific criteria provided
            bloodDonors = bloodDonorService.findAll(BloodDonorStatus.ACTIVE);
        }
        return bloodDonors;
    }

    @GetMapping(value = "/donor/{id}")
    public BloodDonor find(@PathVariable(name = "id") Long id) {
        return bloodDonorService.findById(id);
    }

    @DeleteMapping(value = "/donor/{id}")
    public BloodDonor delete(@PathVariable(name = "id") Long id) {
        return bloodDonorService.delete(id);
    }


    @PatchMapping(value = "/donor/{id}")
    public BloodDonor update(@PathVariable(name = "id") Long id, @RequestBody BloodDonorStatusDTO donorStatusDTO) {
        return bloodDonorService.update(id, donorStatusDTO);
    }
}