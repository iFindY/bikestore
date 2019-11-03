package de.arkadi.shop.model;

import com.fasterxml.jackson.annotation.*;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;


@Data
@Entity
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name, email, phone, model;
    String serialNumber;
    private BigDecimal purchasePrice;
    private Date purchaseDate;
    private boolean contact;
}
