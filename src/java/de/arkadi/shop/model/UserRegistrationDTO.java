package de.arkadi.shop.model;


import de.arkadi.shop.validation.common.Severity;
import de.arkadi.shop.validation.password.PasswordPolicy;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import com.fasterxml.jackson.annotation.JsonSetter;
import de.arkadi.shop.validation.email.UniqueEmail;
import de.arkadi.shop.validation.password.EqualPassword;

@EqualPassword(payload = Severity.Error.class)
public class UserRegistrationDTO implements ValidPassword {


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
        this.email = email;
    }


    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getConfirmedPassword() {
        return confirmedPassword;
    }
}

