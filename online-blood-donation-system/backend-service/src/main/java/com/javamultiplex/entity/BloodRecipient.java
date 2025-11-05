package com.javamultiplex.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.javamultiplex.enums.BloodRecipientStatus;
import com.javamultiplex.enums.OrganType;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * @author Rohit Agarwal on 25/05/20 10:03 pm
 * @copyright www.javamultiplex.com
 */
@Entity
@Table(name = "BLOOD_RECIPIENT")
@Getter
@Setter
public class BloodRecipient implements Serializable {

    private static final long serialVersionUID = 2206946709175217534L;

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "PATIENT_NAME")
    private String patientName;

    @Column(name = "GENDER")
    private String gender;

    @Column(name = "REQUIRED_BLOOD_GROUP")
    private String requiredBloodGroup;

    @Column(name = "BLOOD_UNIT")
    private Long bloodUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "REQUIRED_ORGAN_TYPE")
    private OrganType requiredOrganType;

    @Column(name = "ORGAN_QUANTITY_REQUIRED")
    private Integer organQuantityRequired;

    @Column(name = "DATE")
    private String date;

    @Column(name = "HOSPITAL_NAME")
    private String hospitalName;

    @Column(name = "CITY")
    private String city;

    @Column(name = "PINCODE")
    private String pincode;

    @Column(name = "CONTACT_NAME")
    private String contactName;

    @Column(name = "EMAIL_ID")
    private String emailId;

    @Column(name = "PHONE_NUMBER")
    private String phoneNumber;

    @Column(name = "REQUESTER_HOSPITAL_ID")
    private Long requesterHospitalId;

    @Column(name = "REASON")
    private String reason;

    @Column(name = "STATUS")
    @Enumerated(EnumType.STRING)
    private BloodRecipientStatus status;

    @Column(name = "COMMENT")
    private String comment;

    @Column(name = "DONOR_ID")
    private Long donorId;

    @Column(name = "APPROVAL_STATUS")
    private String approvalStatus;

    @Column(name = "APPROVAL_DATE")
    private String approvalDate;

    @JsonIgnore
    @Lob
    @Column(name = "PRESCRIPTION", columnDefinition = "BLOB")
    private byte[] prescription;
}
