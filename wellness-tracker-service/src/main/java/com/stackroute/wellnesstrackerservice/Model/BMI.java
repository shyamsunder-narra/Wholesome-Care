package com.stackroute.wellnesstrackerservice.Model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class BMI {
    private double weight;
    private String weightUnit;
    private double height;
    private String heightUnit;
}
