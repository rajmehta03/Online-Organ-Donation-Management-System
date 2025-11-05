package com.javamultiplex.repository;

import com.javamultiplex.entity.BloodRecipient;
import com.javamultiplex.enums.BloodRecipientStatus;
import com.javamultiplex.enums.OrganType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author Rohit Agarwal on 25/05/20 10:14 pm
 * @copyright www.javamultiplex.com
 */
public interface BloodRecipientRepository extends JpaRepository<BloodRecipient, Long> {
    
    List<BloodRecipient> findAllByRequiredOrganTypeAndPincodeAndStatus(
        OrganType organType, String pincode, BloodRecipientStatus status);
    
    List<BloodRecipient> findAllByPincodeAndStatus(String pincode, BloodRecipientStatus status);
    
    List<BloodRecipient> findAllByRequesterHospitalId(Long hospitalId);
    
    List<BloodRecipient> findAllByDonorIdIsNotNull();
    
    List<BloodRecipient> findAllByStatus(BloodRecipientStatus status);
    
    List<BloodRecipient> findAllByEmailId(String emailId);
    
    List<BloodRecipient> findAllByEmailIdOrderByIdDesc(String emailId);
}
