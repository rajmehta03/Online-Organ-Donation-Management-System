package com.javamultiplex.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javamultiplex.dto.ErrorResponseDTO;
import com.javamultiplex.entity.BloodDonor;
import com.javamultiplex.entity.BloodRecipient;
import com.javamultiplex.enums.BloodRecipientStatus;
import com.javamultiplex.enums.OrganType;
import com.javamultiplex.error.ServiceException;
import com.javamultiplex.mapper.BloodRecipientObjectMapper;
import com.javamultiplex.model.BloodRecipientDTO;
import com.javamultiplex.model.BloodRecipientStatusDTO;
import com.javamultiplex.repository.BloodRecipientRepository;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * @author Rohit Agarwal on 25/05/20 10:15 pm
 * @copyright www.javamultiplex.com
 */
@Service
public class BloodRecipientService {

    private final BloodRecipientRepository bloodRecipientRepository;
    private final BloodRecipientObjectMapper bloodRecipientObjectMapper;
    private final BloodDonorService bloodDonorService;

    @Autowired
    public BloodRecipientService(BloodRecipientRepository bloodRecipientRepository,
                                 BloodRecipientObjectMapper bloodRecipientObjectMapper,
                                 BloodDonorService bloodDonorService) {
        this.bloodRecipientRepository = bloodRecipientRepository;
        this.bloodRecipientObjectMapper = bloodRecipientObjectMapper;
        this.bloodDonorService = bloodDonorService;
    }

    /**
     * @param request
     * @param prescription
     * @return
     */
    public BloodRecipient register(String request, MultipartFile prescription) {
        System.out.println("Request is : " + request);
        BloodRecipientDTO bloodRecipientDTO = null;
        try {
            bloodRecipientDTO = new ObjectMapper().readValue(request, BloodRecipientDTO.class);
        } catch (JsonProcessingException e) {
            throw new ServiceException(ErrorResponseDTO
                    .builder()
                    .developerMessage(ExceptionUtils.getRootCauseMessage(e))
                    .userMessage("Exception comes while mapping blood recipient json request to object.")
                    .statusCode(500)
                    .build());
        }
        BloodRecipient bloodRecipient = bloodRecipientObjectMapper.map(bloodRecipientDTO);
        try {
            bloodRecipient.setPrescription(prescription.getBytes());
        } catch (IOException e) {
            throw new ServiceException(ErrorResponseDTO
                    .builder()
                    .developerMessage(ExceptionUtils.getRootCauseMessage(e))
                    .userMessage("Exception comes while getting recipient prescription's byte[] content")
                    .statusCode(500)
                    .build());
        }
        return bloodRecipientRepository.save(bloodRecipient);
    }

    public List<BloodRecipient> findAll() {
        return bloodRecipientRepository.findAll();
    }

    /**
     * @param id
     * @return
     */
    public BloodRecipient findById(Long id) {
        Optional<BloodRecipient> bloodRecipient = bloodRecipientRepository.findById(id);
        if (bloodRecipient.isPresent()) {
            return bloodRecipient.get();
        } else {
            throw new ServiceException(
                    ErrorResponseDTO
                            .builder()
                            .statusCode(404)
                            .developerMessage("Recipient not found with id " + id)
                            .userMessage("Recipient not found with id " + id)
                            .build()
            );
        }
    }

    /**
     * @param id
     * @return
     */
    public BloodRecipient delete(Long id) {
        BloodRecipient bloodRecipient = findById(id);
        bloodRecipientRepository.delete(bloodRecipient);
        return bloodRecipient;
    }

    /**
     * @param id
     * @return
     */
    public BloodRecipient update(Long id, BloodRecipientStatusDTO bloodRecipientStatusDTO) {
        BloodRecipient bloodRecipient = findById(id);
        bloodRecipient.setStatus(bloodRecipientStatusDTO.getStatus());
        bloodRecipient.setComment(bloodRecipientStatusDTO.getComment());
        return bloodRecipientRepository.save(bloodRecipient);
    }

    /**
     * Find all matching requests for a donor based on their organ type and location
     * @param donorId
     * @return
     */
    public List<BloodRecipient> findMatchingRequestsForDonor(Long donorId) {
        BloodDonor donor = bloodDonorService.findById(donorId);
        
        if (donor.getOrganType() != null && donor.getOrganActive() != null && donor.getOrganActive()) {
            return bloodRecipientRepository.findAllByRequiredOrganTypeAndPincodeAndStatus(
                donor.getOrganType(),
                donor.getAddress().getZip(),
                BloodRecipientStatus.PENDING
            );
        }
        
        // If no organ type, return all pending requests in donor's area
        return bloodRecipientRepository.findAllByPincodeAndStatus(
            donor.getAddress().getZip(),
            BloodRecipientStatus.PENDING
        );
    }

    /**
     * Approve a request by a donor
     * @param requestId
     * @param donorId
     * @return
     */
    public BloodRecipient approveRequest(Long requestId, Long donorId) {
        BloodRecipient request = findById(requestId);
        BloodDonor donor = bloodDonorService.findById(donorId);
        
        // Validate donor has the required organ
        if (request.getRequiredOrganType() != null) {
            if (!request.getRequiredOrganType().equals(donor.getOrganType())) {
                throw new ServiceException(
                    ErrorResponseDTO
                        .builder()
                        .statusCode(400)
                        .developerMessage("Donor organ type does not match request")
                        .userMessage("You cannot approve this request as organ type does not match")
                        .build()
                );
            }
            
            // Check if donor has enough quantity
            if (donor.getOrganQuantity() == null || donor.getOrganQuantity() < request.getOrganQuantityRequired()) {
                throw new ServiceException(
                    ErrorResponseDTO
                        .builder()
                        .statusCode(400)
                        .developerMessage("Donor does not have enough organs")
                        .userMessage("You do not have enough organs to fulfill this request")
                        .build()
                );
            }
            
            // Decrease donor's organ quantity
            donor.setOrganQuantity(donor.getOrganQuantity() - request.getOrganQuantityRequired());
            bloodDonorService.save(donor);
        }
        
        // Update request with approval details
        request.setDonorId(donorId);
        request.setApprovalStatus("APPROVED");
        request.setApprovalDate(java.time.LocalDate.now().toString());
        request.setStatus(BloodRecipientStatus.ACKNOWLEDGED);
        
        return bloodRecipientRepository.save(request);
    }

    /**
     * Get all requests made by a hospital
     * @param hospitalId
     * @return
     */
    public List<BloodRecipient> getRequestsByHospital(Long hospitalId) {
        return bloodRecipientRepository.findAllByRequesterHospitalId(hospitalId);
    }

    /**
     * Get all requests for organs listed by a hospital's donors
     * @param hospitalId
     * @return
     */
    public List<BloodRecipient> getRequestsForHospitalOrgans(Long hospitalId) {
        // Get all donors from this hospital
        List<BloodDonor> hospitalDonors = bloodDonorService.findAll(com.javamultiplex.enums.BloodDonorStatus.ACTIVE)
                .stream()
                .filter(donor -> donor.getHospitalId() != null && donor.getHospitalId().equals(hospitalId))
                .toList();
        
        // Get donor IDs
        List<Long> donorIds = hospitalDonors.stream()
                .map(BloodDonor::getId)
                .toList();
        
        // Get all approved requests for these donors
        return bloodRecipientRepository.findAllByDonorIdIsNotNull()
                .stream()
                .filter(request -> donorIds.contains(request.getDonorId()))
                .toList();
    }
    
    /**
     * Get all requests by email
     * @param emailId
     * @return
     */
    public List<BloodRecipient> getRequestsByEmail(String emailId) {
        return bloodRecipientRepository.findAllByEmailIdOrderByIdDesc(emailId);
    }
    
    /**
     * Reject a request with reason
     * @param requestId
     * @param reason
     * @return
     */
    public BloodRecipient rejectRequest(Long requestId, String reason) {
        BloodRecipient request = findById(requestId);
        request.setStatus(BloodRecipientStatus.REJECTED);
        request.setComment(reason);
        request.setApprovalStatus("REJECTED");
        request.setApprovalDate(java.time.LocalDate.now().toString());
        return bloodRecipientRepository.save(request);
    }
}
