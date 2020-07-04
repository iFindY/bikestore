package de.arkadi.shop.model;

import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.data.annotation.Transient;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@Entity
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(schema = "SECURITY", name = "USERS")
public class StoreUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    String username;
    String password, email;
    Boolean enabled;
    Integer attempts;


    public Integer decreaseAttempts(){
        return this.attempts > 0 ? this.attempts -= 1 : this.attempts;
    }

    public void increaseAttempts(){
        this.attempts = 3;
    }

    public boolean isLocked() {
        return attempts < 1;
    }

}
