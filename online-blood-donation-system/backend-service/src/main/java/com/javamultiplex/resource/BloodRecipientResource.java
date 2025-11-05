package com.javamultiplex.resource;

import com.javamultiplex.entity.BloodRecipient;
import com.javamultiplex.model.BloodRecipientStatusDTO;
import com.javamultiplex.service.BloodRecipientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author Rohit Agarwal on 30/05/20 1:51 pm
 * @copyright www.javamultiplex.com
 */
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class BloodRecipientResource {

    private final BloodRecipientService bloodRecipientService;

    @Autowired
    public BloodRecipientResource(BloodRecipientService bloodRecipientService) {
        this.bloodRecipientService = bloodRecipientService;
    }

    @PostMapping(value = "/recipient", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BloodRecipient> register(@RequestParam(name = "file") MultipartFile prescription,
                                                   @RequestParam(name = "request") String bloodRecipient) {
        return new ResponseEntity<>(bloodRecipientService.register(bloodRecipient, prescription), HttpStatus.CREATED);
    }

    @GetMapping("/recipients")
    public List<BloodRecipient> findAll() {
        return bloodRecipientService.findAll();
    }

    @GetMapping("/recipient/{id}")
    public BloodRecipient findById(@PathVariable(name = "id") Long id) {
        return bloodRecipientService.findById(id);
    }

    @DeleteMapping("/recipient/{id}")
    public BloodRecipient delete(@PathVariable(name = "id") Long id) {
        return bloodRecipientService.delete(id);
    }

    @PatchMapping("/recipient/{id}")
    public BloodRecipient update(@PathVariable(name = "id") Long id,
                                 @RequestBody BloodRecipientStatusDTO bloodRecipientStatusDTO) {
        return bloodRecipientService.update(id, bloodRecipientStatusDTO);
    }

    @GetMapping("/donor/{donorId}/requests")
    public List<BloodRecipient> getMatchingRequests(@PathVariable(name = "donorId") Long donorId) {
        return bloodRecipientService.findMatchingRequestsForDonor(donorId);
    }

    @PostMapping("/recipient/{requestId}/approve/{donorId}")
    public ResponseEntity<BloodRecipient> approveRequest(
            @PathVariable(name = "requestId") Long requestId,
            @PathVariable(name = "donorId") Long donorId) {
        return new ResponseEntity<>(bloodRecipientService.approveRequest(requestId, donorId), HttpStatus.OK);
    }

    @GetMapping("/hospital/{hospitalId}/requests/made")
    public List<BloodRecipient> getHospitalRequestsMade(@PathVariable(name = "hospitalId") Long hospitalId) {
        return bloodRecipientService.getRequestsByHospital(hospitalId);
    }

    @GetMapping("/hospital/{hospitalId}/requests/received")
    public List<BloodRecipient> getHospitalRequestsReceived(@PathVariable(name = "hospitalId") Long hospitalId) {
        return bloodRecipientService.getRequestsForHospitalOrgans(hospitalId);
    }
    
    @GetMapping("/requests/by-email")
    public List<BloodRecipient> getRequestsByEmail(@RequestParam(name = "email") String email) {
        return bloodRecipientService.getRequestsByEmail(email);
    }
    
    @PostMapping("/recipient/{requestId}/reject")
    public ResponseEntity<BloodRecipient> rejectRequest(
            @PathVariable(name = "requestId") Long requestId,
            @RequestBody String reason) {
        return new ResponseEntity<>(bloodRecipientService.rejectRequest(requestId, reason), HttpStatus.OK);
    }
    
    @GetMapping("/recipient/{id}/prescription")
    public ResponseEntity<byte[]> getPrescription(@PathVariable(name = "id") Long id) {
        BloodRecipient recipient = bloodRecipientService.findById(id);
        if (recipient != null && recipient.getPrescription() != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(recipient.getPrescription());
        }
        return ResponseEntity.notFound().build();
    }
}
