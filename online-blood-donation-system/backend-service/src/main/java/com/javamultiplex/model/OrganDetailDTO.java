package com.javamultiplex.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
public class OrganDetailDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long donorId;
    private String donorName;
    private String email;
    private Integer age;
    private String gender;
    private String phoneNumber;
    private String organType;
    private Integer quantity;
    private String lifeSpan;
    private Boolean isActive;
    private String hospitalName;
    private String location;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String bloodGroup;
}
