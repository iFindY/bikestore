package de.arkadi.shop.services;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import de.arkadi.shop.entity.User;
import de.arkadi.shop.model.UserRegistrationDTO;
import de.arkadi.shop.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserRegistrationService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public void registerNewUser(UserRegistrationDTO user) {

        User newUser = new User(user.getEmail(), encoder.encode(user.getPassword()));


        repository.save(newUser);
    }

}

