package de.arkadi.shop.model;


import de.arkadi.shop.validation.PasswordPolicy;
import de.arkadi.shop.validation.password.EqualPassword;
import javax.validation.constraints.Email;

@EqualPassword(message = "given password's do not match")
public class ResetPasswordDTO implements ValidPassword {

  @Email(message="Email is not valid")
  String email;

  @PasswordPolicy(message = "to simple")
  String newPassword;

  String confirmedPassword;

  public ResetPasswordDTO(String email, String newPassword, String confirmedPassword) {
    this.email = email;
    this.newPassword = newPassword;
    this.confirmedPassword = confirmedPassword;
  }


  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getNewPassword() {
    return newPassword;
  }

  public void setNewPassword(String newPassword) {
    this.newPassword = newPassword;
  }

  public String getConfirmedPassword() {
    return confirmedPassword;
  }

  public void setConfirmedPassword(String confirmedPassword) {
    this.confirmedPassword = confirmedPassword;
  }
}
