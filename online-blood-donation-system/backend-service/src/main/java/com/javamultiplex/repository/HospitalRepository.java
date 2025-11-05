package com.javamultiplex.repository;

import com.javamultiplex.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    
    Optional<Hospital> findByEmail(String email);
    
    Optional<Hospital> findByHospitalName(String hospitalName);
    
    boolean existsByEmail(String email);
    
    boolean existsByHospitalName(String hospitalName);
}
