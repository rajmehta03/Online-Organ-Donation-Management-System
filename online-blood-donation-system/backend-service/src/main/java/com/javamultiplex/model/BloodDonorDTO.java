package com.javamultiplex.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

/**
 * @author Rohit Agarwal on 17/05/20 7:34 pm
 * @copyright www.javamultiplex.com
 */
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class BloodDonorDTO implements Serializable {
    private static final long serialVersionUID = 7100917559643055906L;
    private String firstName;
    private String middleName;
    private String lastName;
    private String gender;
    private String bloodGroup;
    private String bodyWeight;
    private String dob;
    private String emailId;
    private String phoneNumber;
    // Address fields - now accepting text values directly
    private String country;
    private String state;
    private String city;
    private String area;
    private String address;
    private String pincode;
    // Legacy ID fields for backward compatibility
    private String countryId;
    private String stateId;
    private String cityId;
    private String areaId;
    // Organ-specific fields
    private String organType;
    private String organLifeSpan;
    private Boolean organActive;
    private Integer organQuantity;
    private Long hospitalId;
}
