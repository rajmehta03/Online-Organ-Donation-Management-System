package com.javamultiplex.enums;

/**
 * Enum representing different types of organs for donation
 */
public enum OrganType {
    KIDNEY("Kidney"),
    LIVER("Liver"),
    HEART("Heart"),
    LUNG("Lung"),
    PANCREAS("Pancreas"),
    CORNEA("Cornea"),
    SKIN("Skin"),
    BONE("Bone"),
    INTESTINE("Intestine"),
    BONE_MARROW("Bone Marrow");

    private final String displayName;

    OrganType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
