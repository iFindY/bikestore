package de.arkadi.shop.services;


import static de.arkadi.shop.entity.User.UserBuilder.anUser;
import static de.arkadi.shop.entity.enums.UserRights.USER;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.arkadi.shop.entity.User;
import de.arkadi.shop.model.UserRegistrationDTO;
import de.arkadi.shop.repository.UserRepository;


@Service
public class UserRegistrationService {

    private final UserRepository userRepository;

    private final PasswordEncoder encoder;

    public UserRegistrationService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @Transactional
    public User registerNewUser(UserRegistrationDTO user) {

        User newUser = anUser()
            .withEmail(user.getEmail())
            .withPassword(encoder.encode(user.getPassword()))
            .withAuthority(USER)
            .build();

        userRepository.save(newUser);
        return newUser;
    }

}

