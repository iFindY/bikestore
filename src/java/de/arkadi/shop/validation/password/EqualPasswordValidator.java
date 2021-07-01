package de.arkadi.shop.validation.password;

import de.arkadi.shop.model.ValidPassword;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class EqualPasswordValidator implements ConstraintValidator<EqualPassword, ValidPassword> {

  @Override
  public void initialize(EqualPassword constraintAnnotation) {

  }

  @Override
  public boolean isValid(ValidPassword value, ConstraintValidatorContext context) {

    return value.getPassword().equals(value.getConfirmedPassword());
  }
}
