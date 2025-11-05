package com.javamultiplex.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.javamultiplex.enums.BloodDonorStatus;
import com.javamultiplex.enums.OrganType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "BLOOD_DONORS")
@Getter
@Setter
@ToString
public class BloodDonor implements Serializable {

    private static final long serialVersionUID = 6966174184731925614L;

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "MIDDLE_NAME")
    private String middleName;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "GENDER")
    private String gender;

    @Column(name = "BLOOD_GROUP")
    private String bloodGroup;

    @Column(name = "BODY_WEIGHT")
    private String bodyWeight;

    @Enumerated(EnumType.STRING)
    @Column(name = "ORGAN_TYPE")
    private OrganType organType;

    @Column(name = "ORGAN_LIFE_SPAN")
    private String organLifeSpan;

    @Column(name = "ORGAN_ACTIVE")
    private Boolean organActive;

    @Column(name = "ORGAN_QUANTITY")
    private Integer organQuantity;

    @Column(name = "BIRTH_DATE")
    private String dob;

    @Column(name = "EMAIL")
    private String emailId;

    @Column(name = "MOBILE")
    private String phoneNumber;

    @Column(name = "HOSPITAL_ID")
    private Long hospitalId;

    @Embedded
    private Address address;

    @Enumerated(EnumType.STRING)
    @Column(name="STATUS")
    private BloodDonorStatus status;

    @JsonIgnore
    @Lob
    @Column(name = "PROFILE_IMAGE", columnDefinition = "BLOB")
    private byte[] image;
}
