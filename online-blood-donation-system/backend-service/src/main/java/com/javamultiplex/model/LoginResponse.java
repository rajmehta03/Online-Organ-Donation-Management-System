package com.javamultiplex.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse implements Serializable {
    private static final long serialVersionUID = 2222222222222222222L;

    private Long hospitalId;
    private String hospitalName;
    private String email;
    private String token;
    private String message;
}
