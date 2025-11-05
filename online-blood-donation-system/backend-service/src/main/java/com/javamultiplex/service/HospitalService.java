package com.javamultiplex.service;

import com.javamultiplex.dto.ErrorResponseDTO;
import com.javamultiplex.entity.Hospital;
import com.javamultiplex.error.ServiceException;
import com.javamultiplex.model.HospitalDTO;
import com.javamultiplex.model.LoginRequest;
import com.javamultiplex.model.LoginResponse;
import com.javamultiplex.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    @Autowired
    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public Hospital register(HospitalDTO hospitalDTO) {
        // Check if email already exists
        if (hospitalRepository.existsByEmail(hospitalDTO.getEmail())) {
            throw new ServiceException(ErrorResponseDTO.builder()
                    .statusCode(400)
                    .userMessage("Email already registered")
                    .developerMessage("Email " + hospitalDTO.getEmail() + " already exists")
                    .build());
        }

        // Check if hospital name already exists
        if (hospitalRepository.existsByHospitalName(hospitalDTO.getHospitalName())) {
            throw new ServiceException(ErrorResponseDTO.builder()
                    .statusCode(400)
                    .userMessage("Hospital name already registered")
                    .developerMessage("Hospital " + hospitalDTO.getHospitalName() + " already exists")
                    .build());
        }

        Hospital hospital = new Hospital();
        hospital.setHospitalName(hospitalDTO.getHospitalName());
        hospital.setEmail(hospitalDTO.getEmail());
        // Simple password encoding (in production, use BCrypt)
        hospital.setPassword(encodePassword(hospitalDTO.getPassword()));
        hospital.setPhoneNumber(hospitalDTO.getPhoneNumber());
        hospital.setAddress(hospitalDTO.getAddress());
        hospital.setCity(hospitalDTO.getCity());
        hospital.setState(hospitalDTO.getState());
        hospital.setCountry(hospitalDTO.getCountry());
        hospital.setPincode(hospitalDTO.getPincode());
        hospital.setLicenseNumber(hospitalDTO.getLicenseNumber());
        hospital.setContactPerson(hospitalDTO.getContactPerson());
        hospital.setIsActive(true); // Explicitly set active status

        return hospitalRepository.save(hospital);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        Optional<Hospital> hospitalOpt = hospitalRepository.findByEmail(loginRequest.getEmail());

        if (hospitalOpt.isEmpty()) {
            throw new ServiceException(ErrorResponseDTO.builder()
                    .statusCode(401)
                    .userMessage("Invalid credentials")
                    .developerMessage("Hospital not found with email: " + loginRequest.getEmail())
                    .build());
        }

        Hospital hospital = hospitalOpt.get();

        // Verify password
        if (!verifyPassword(loginRequest.getPassword(), hospital.getPassword())) {
            throw new ServiceException(ErrorResponseDTO.builder()
                    .statusCode(401)
                    .userMessage("Invalid credentials")
                    .developerMessage("Password mismatch for email: " + loginRequest.getEmail())
                    .build());
        }

        if (!hospital.getIsActive()) {
            throw new ServiceException(ErrorResponseDTO.builder()
                    .statusCode(403)
                    .userMessage("Hospital account is inactive")
                    .developerMessage("Hospital account is inactive for: " + hospital.getHospitalName())
                    .build());
        }

        // Generate simple token (in production, use JWT)
        String token = generateToken(hospital.getId());

        return new LoginResponse(
                hospital.getId(),
                hospital.getHospitalName(),
                hospital.getEmail(),
                token,
                "Login successful"
        );
    }

    public Hospital getHospitalById(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new ServiceException(ErrorResponseDTO.builder()
                        .statusCode(404)
                        .userMessage("Hospital not found")
                        .developerMessage("Hospital not found with id: " + id)
                        .build()));
    }

    private String encodePassword(String password) {
        // Simple Base64 encoding (in production, use BCrypt or similar)
        return Base64.getEncoder().encodeToString(password.getBytes());
    }

    private boolean verifyPassword(String rawPassword, String encodedPassword) {
        String encoded = Base64.getEncoder().encodeToString(rawPassword.getBytes());
        return encoded.equals(encodedPassword);
    }

    private String generateToken(Long hospitalId) {
        // Simple token generation (in production, use JWT)
        return Base64.getEncoder().encodeToString(
                (hospitalId + ":" + UUID.randomUUID().toString()).getBytes()
        );
    }
}
