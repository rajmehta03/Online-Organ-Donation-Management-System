package com.javamultiplex.repository;

import com.javamultiplex.entity.BloodDonor;
import com.javamultiplex.enums.BloodDonorStatus;
import com.javamultiplex.enums.OrganType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodDonorRepository extends JpaRepository<BloodDonor, Long> {
    List<BloodDonor> findAllByAddressZipAndBloodGroupAndStatus(String zip, String bloodGroup, BloodDonorStatus status);
    List<BloodDonor> findAllByStatus(BloodDonorStatus status);
    // Organ-based queries
    List<BloodDonor> findAllByAddressZipAndOrganTypeAndOrganActiveAndStatus(String zip, OrganType organType, Boolean organActive, BloodDonorStatus status);
    List<BloodDonor> findAllByOrganTypeAndOrganActiveAndStatus(OrganType organType, Boolean organActive, BloodDonorStatus status);
    List<BloodDonor> findAllByOrganTypeIsNotNullAndOrganActiveAndStatus(Boolean organActive, BloodDonorStatus status);
    List<BloodDonor> findAllByHospitalId(Long hospitalId);
}
