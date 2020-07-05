package de.arkadi.shop.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import de.arkadi.shop.repository.UserRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

    private final UserRepository repository;

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        return username != null && repository.findStoreUserByUsername(username) == null;
    }

}
