package com.javamultiplex.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "HOSPITALS")
@Getter
@Setter
public class Hospital implements Serializable {

    private static final long serialVersionUID = 1234567890123456789L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "HOSPITAL_NAME", nullable = false, unique = true)
    private String hospitalName;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Column(name = "PHONE_NUMBER")
    private String phoneNumber;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "CITY")
    private String city;

    @Column(name = "STATE")
    private String state;

    @Column(name = "COUNTRY")
    private String country;

    @Column(name = "PINCODE")
    private String pincode;

    @Column(name = "LICENSE_NUMBER")
    private String licenseNumber;

    @Column(name = "REGISTERED_DATE")
    private LocalDateTime registeredDate;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive = true;

    @Column(name = "CONTACT_PERSON")
    private String contactPerson;

    @PrePersist
    protected void onCreate() {
        registeredDate = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
    }
}
