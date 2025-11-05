package com.javamultiplex.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
public class BloodRecipientDTO implements Serializable {
    private static final long serialVersionUID = 5555555555555555555L;

    private String patientName;
    private String gender;
    private String requiredBloodGroup;
    private Long bloodUnit;
    private String requiredOrganType;
    private Integer organQuantityRequired;
    private String date;
    private String hospitalName;
    private String city;
    private String pincode;
    private String contactName;
    private String emailId;
    private String phoneNumber;
    private String reason;
    private Long requesterHospitalId;
}
