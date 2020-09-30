package de.arkadi.shop.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.constraintvalidation.SupportedValidationTarget;
import javax.validation.constraintvalidation.ValidationTarget;


//TIP   Object[] as input of the constructor
@SupportedValidationTarget(ValidationTarget.PARAMETERS)
public class EqualPasswordValidator implements ConstraintValidator<EqualEmailParameters, Object[]> {

    @Override
    public void initialize(EqualEmailParameters constraintAnnotation) {}

    @Override
    public boolean isValid(Object[] value, ConstraintValidatorContext context) {

        if (!(value[3] instanceof String) || !(value[4] instanceof String)) {
            throw new IllegalArgumentException("Illegal method signature. Two String parameters expected.");
        }

        return value[3].equals(value[4]);
    }
}
