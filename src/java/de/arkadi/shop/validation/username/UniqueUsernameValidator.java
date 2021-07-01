package de.arkadi.shop.validation.username;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import de.arkadi.shop.repository.UserRepository;


public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

    private final UserRepository repository;

    public UniqueUsernameValidator(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        return username != null && repository.findUserByName(username) == null;
    }

}
