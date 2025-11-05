package com.javamultiplex.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
public class LoginRequest implements Serializable {
    private static final long serialVersionUID = 1111111111111111111L;

    private String email;
    private String password;
}
