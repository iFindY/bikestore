package de.arkadi.shop.validation.password;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import de.arkadi.shop.model.UserRegistrationDTO;

public class EqualPasswordValidator implements ConstraintValidator<EqualPassword, UserRegistrationDTO> {

    @Override
    public void initialize(EqualPassword constraintAnnotation) {}

    @Override
    public boolean isValid(UserRegistrationDTO value, ConstraintValidatorContext context) {

        return value.getPassword().equals(value.getConfirmedPassword());
    }
}
