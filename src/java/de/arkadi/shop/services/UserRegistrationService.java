package de.arkadi.shop.services;


import static de.arkadi.shop.entity.Authority.UserRights.*;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.arkadi.shop.entity.Authority;
import de.arkadi.shop.entity.User;
import de.arkadi.shop.model.UserRegistrationDTO;
import de.arkadi.shop.repository.AuthoritiesRepository;
import de.arkadi.shop.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final AuthoritiesRepository authoritiesRepository;

    private final PasswordEncoder encoder;

    public void registerNewUser(UserRegistrationDTO user) {

        User newUser = new User(user.getEmail(), encoder.encode(user.getPassword()));
        Authority authority = new Authority(user.getEmail(), USER);

        userRepository.save(newUser);
        authoritiesRepository.save(authority);
    }

}

