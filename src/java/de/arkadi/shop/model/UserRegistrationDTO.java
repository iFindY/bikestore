package de.arkadi.shop.model;



import java.util.Base64;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import com.fasterxml.jackson.annotation.JsonSetter;
import de.arkadi.shop.validation.PasswordPolicy;
import de.arkadi.shop.validation.UniqueEmail;
import de.arkadi.shop.validation.password.EqualPassword;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@EqualPassword
@NoArgsConstructor
public class UserRegistrationDTO {


    @NotEmpty(message="Please enter an email")
    @Email(message="Email is not valid")
    @UniqueEmail
    private String email;

    @NotEmpty(message="Please enter in a password")
    @PasswordPolicy
    private String password;

    @NotEmpty(message="Please confirm your password")
    private String confirmedPassword;


    @JsonSetter("email")
    public void setEmail(String email) {
        this.email = decode(email);
    }

    @JsonSetter("password")
    public void setPassword(String password) {
        this.password = decode(password);

    }

    @JsonSetter("confirmedPassword")
    public void setConfirmedPassword(String confirmedPassword) {
        this.confirmedPassword = decode(confirmedPassword);
    }

    private String decode(String base64){
        return new String (Base64.getDecoder().decode(base64.getBytes()));
    }

}
