package com.javamultiplex.service;

import com.javamultiplex.entity.BloodDonor;
import com.javamultiplex.enums.BloodDonorStatus;
import com.javamultiplex.enums.OrganType;
import com.javamultiplex.model.OrganDetailDTO;
import com.javamultiplex.model.OrganInventoryDTO;
import com.javamultiplex.repository.BloodDonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrganInventoryService {

    private final BloodDonorRepository bloodDonorRepository;

    @Autowired
    public OrganInventoryService(BloodDonorRepository bloodDonorRepository) {
        this.bloodDonorRepository = bloodDonorRepository;
    }

    public Map<String, OrganInventoryDTO> getOrganInventory() {
        List<BloodDonor> allOrgans = bloodDonorRepository.findAllByOrganTypeIsNotNullAndOrganActiveAndStatus(
                true, BloodDonorStatus.ACTIVE);

        Map<String, OrganInventoryDTO> inventory = new LinkedHashMap<>();

        // Group by organ type
        Map<OrganType, List<BloodDonor>> groupedByType = allOrgans.stream()
                .filter(donor -> donor.getOrganType() != null)
                .collect(Collectors.groupingBy(BloodDonor::getOrganType));

        // Create inventory for each organ type
        for (OrganType organType : OrganType.values()) {
            List<BloodDonor> organsOfType = groupedByType.getOrDefault(organType, new ArrayList<>());
            long totalCount = organsOfType.stream()
                    .mapToInt(donor -> donor.getOrganQuantity() != null ? donor.getOrganQuantity() : 0)
                    .sum();

            List<OrganDetailDTO> organDetails = organsOfType.stream()
                    .map(this::mapToOrganDetailDTO)
                    .collect(Collectors.toList());

            OrganInventoryDTO inventoryDTO = new OrganInventoryDTO(
                    organType,
                    totalCount,
                    organDetails
            );

            inventory.put(organType.name(), inventoryDTO);
        }

        return inventory;
    }

    public List<OrganDetailDTO> searchOrgans(String organType, String pincode, String city) {
        List<BloodDonor> donors;

        if (organType != null && !organType.isEmpty()) {
            OrganType organ = OrganType.valueOf(organType);
            if (pincode != null && !pincode.isEmpty()) {
                donors = bloodDonorRepository.findAllByAddressZipAndOrganTypeAndOrganActiveAndStatus(
                        pincode, organ, true, BloodDonorStatus.ACTIVE);
            } else {
                donors = bloodDonorRepository.findAllByOrganTypeAndOrganActiveAndStatus(
                        organ, true, BloodDonorStatus.ACTIVE);
            }
        } else {
            donors = bloodDonorRepository.findAllByOrganTypeIsNotNullAndOrganActiveAndStatus(
                    true, BloodDonorStatus.ACTIVE);
        }

        // Filter by city if provided
        if (city != null && !city.isEmpty()) {
            donors = donors.stream()
                    .filter(donor -> donor.getAddress() != null &&
                            city.equalsIgnoreCase(donor.getAddress().getCity()))
                    .collect(Collectors.toList());
        }

        return donors.stream()
                .map(this::mapToOrganDetailDTO)
                .collect(Collectors.toList());
    }

    public List<OrganDetailDTO> getOrgansByHospital(Long hospitalId) {
        List<BloodDonor> donors = bloodDonorRepository.findAllByHospitalId(hospitalId);
        return donors.stream()
                .filter(donor -> donor.getOrganType() != null)
                .map(this::mapToOrganDetailDTO)
                .collect(Collectors.toList());
    }

    private OrganDetailDTO mapToOrganDetailDTO(BloodDonor donor) {
        OrganDetailDTO dto = new OrganDetailDTO();
        dto.setDonorId(donor.getId());
        dto.setDonorName(donor.getFirstName() + " " + donor.getLastName());
        dto.setEmail(donor.getEmailId());
        dto.setPhoneNumber(donor.getPhoneNumber());
        dto.setGender(donor.getGender());
        
        // Calculate age from DOB
        if (donor.getDob() != null && !donor.getDob().isEmpty()) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                LocalDate birthDate = LocalDate.parse(donor.getDob(), formatter);
                LocalDate currentDate = LocalDate.now();
                int age = Period.between(birthDate, currentDate).getYears();
                dto.setAge(age);
            } catch (Exception e) {
                // If date parsing fails, set age as null
                dto.setAge(null);
            }
        }
        
        dto.setOrganType(donor.getOrganType() != null ? donor.getOrganType().name() : null);
        dto.setQuantity(donor.getOrganQuantity());
        dto.setLifeSpan(donor.getOrganLifeSpan());
        dto.setIsActive(donor.getOrganActive());
        dto.setBloodGroup(donor.getBloodGroup());

        if (donor.getAddress() != null) {
            dto.setLocation(donor.getAddress().getCompleteAddress());
            dto.setCity(donor.getAddress().getCity());
            dto.setState(donor.getAddress().getState());
            dto.setCountry(donor.getAddress().getCountry());
            dto.setPincode(donor.getAddress().getZip());
        }
        
        // TODO: Fetch hospital name from Hospital entity if hospitalId is present
        if (donor.getHospitalId() != null) {
            // For now, we'll leave it null. Can be enhanced later to fetch hospital name
            dto.setHospitalName(null);
        }

        return dto;
    }
}
