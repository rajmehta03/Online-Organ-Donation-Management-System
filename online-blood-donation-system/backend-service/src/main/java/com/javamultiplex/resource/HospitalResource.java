package com.javamultiplex.resource;

import com.javamultiplex.entity.Hospital;
import com.javamultiplex.model.HospitalDTO;
import com.javamultiplex.model.LoginRequest;
import com.javamultiplex.model.LoginResponse;
import com.javamultiplex.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/hospital")
@CrossOrigin(origins = "*")
public class HospitalResource {

    private final HospitalService hospitalService;

    @Autowired
    public HospitalResource(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @PostMapping("/register")
    public ResponseEntity<Hospital> register(@RequestBody HospitalDTO hospitalDTO) {
        Hospital hospital = hospitalService.register(hospitalDTO);
        return new ResponseEntity<>(hospital, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = hospitalService.login(loginRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospital(@PathVariable Long id) {
        Hospital hospital = hospitalService.getHospitalById(id);
        return new ResponseEntity<>(hospital, HttpStatus.OK);
    }
}
