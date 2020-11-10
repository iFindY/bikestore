package de.arkadi.shop.validation;

import javax.validation.ConstraintValidator;

import javax.validation.ConstraintValidatorContext;

import de.arkadi.shop.repository.UserRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    private final UserRepository repository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return email != null && repository.findUserByMail(email) == null;
    }

}
