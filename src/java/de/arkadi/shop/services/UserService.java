package de.arkadi.shop.services;


import static de.arkadi.shop.entity.User.UserBuilder.anUser;
import static de.arkadi.shop.entity.enums.UserRights.USER;

import de.arkadi.shop.entity.User;
import de.arkadi.shop.model.ResetPasswordDTO;
import de.arkadi.shop.model.UserRegistrationDTO;
import de.arkadi.shop.repository.UserRepository;
import de.arkadi.shop.security.event.resetpassword.UserRestPasswordEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final ApplicationEventPublisher eventPublisher;

    public UserService(UserRepository userRepository,
        PasswordEncoder encoder,
        ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public User registerNewUser(UserRegistrationDTO user) {

        String email = user.getEmail(),
            password = user.getNewPassword();

        User newUser = anUser()
            .withEmail(email)
            .withPassword(encoder.encode(password))
            .withAuthority(USER)
            .build();

       return userRepository.save(newUser);
    }

    @Transactional
    public void resetPassword(ResetPasswordDTO passwordDTO) {
        String email = passwordDTO.getEmail(),
            password = passwordDTO.getNewPassword();

        userRepository
            .findUserByMail(email)
            .ifPresent(user -> user.setPassword(encoder.encode(password)));
    }


    public void sendResetPasswordMail(String email) {

        userRepository.findUserByMail(email)
            .ifPresent(this::publishResetPasswordEvent);
    }

    /// ======================================
    // =               HELPER               =
    // ======================================

    private void publishResetPasswordEvent(User user){
        eventPublisher.publishEvent(new UserRestPasswordEvent(user));
    }
}

