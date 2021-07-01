package de.arkadi.shop.model;


import de.arkadi.shop.validation.common.Severity;
import de.arkadi.shop.validation.password.PasswordPolicy;
import de.arkadi.shop.validation.password.EqualPassword;
import javax.validation.constraints.Email;

@EqualPassword(payload = Severity.Error.class)
public class ResetPasswordDTO implements ValidPassword {

  @Email(message="Email is not valid")
  String email;

  @PasswordPolicy
  String password;

  String confirmedPassword;

  public ResetPasswordDTO(String email, String password, String confirmedPassword) {
    this.email = email;
    this.password = password;
    this.confirmedPassword = confirmedPassword;
  }


  public String getEmail() {
    return email;
  }

  @Override
  public String getPassword() {
    return password;
  }

  public String getConfirmedPassword() {
    return confirmedPassword;
  }
}
