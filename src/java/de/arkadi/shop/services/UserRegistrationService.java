package de.arkadi.shop.services;


import static de.arkadi.shop.entity.Authority.UserRights.*;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import de.arkadi.shop.entity.Authority;
import de.arkadi.shop.entity.UserDBO;
import de.arkadi.shop.model.UserRegistrationDTO;
import de.arkadi.shop.repository.AuthoritiesRepository;
import de.arkadi.shop.repository.UserRepository;


@Service
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final AuthoritiesRepository authoritiesRepository;

    private final PasswordEncoder encoder;

    public UserRegistrationService(UserRepository userRepository, AuthoritiesRepository authoritiesRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.authoritiesRepository = authoritiesRepository;
        this.encoder = encoder;
    }

    public void registerNewUser(UserRegistrationDTO user) {

        UserDBO newUser = new UserDBO(user.getEmail(), encoder.encode(user.getPassword()));
        Authority authority = new Authority(user.getEmail(), USER);


        userRepository.save(newUser);
        authoritiesRepository.save(authority);
    }

}

