package com.javamultiplex.model;

import com.javamultiplex.enums.OrganType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class OrganInventoryDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private OrganType organType;
    private Long totalCount;
    private List<OrganDetailDTO> organDetails;
}
