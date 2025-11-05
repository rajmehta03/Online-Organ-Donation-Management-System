package com.javamultiplex.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
public class HospitalDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String hospitalName;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String licenseNumber;
    private String contactPerson;
}
