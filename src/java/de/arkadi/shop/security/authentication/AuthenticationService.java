package de.arkadi.shop.security.authentication;

import de.arkadi.shop.security.userdetails.CustomUserDetailsService;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.arkadi.shop.entity.User;
import de.arkadi.shop.repository.UserRepository;

/**
 * do provide access to user data
 * just a service between the {@link UserRepository} and the {@link CustomUserDetailsService}
 */
@Service
@Transactional
public class AuthenticationService {

    private final UserRepository userRepository;

    public AuthenticationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> loadUserByUsername(String name){
        return this.userRepository.findUserByName(name);
    }

    public Optional<User> loadUserByEmail(String email){
        return this.userRepository.findUserByMail(email);
    }

    public Boolean performAuthenticationChecks(String email) {
        return loadUserByEmail(email).map(User::getEnabled).orElse(false);
    }

    public Integer decreaseRemainingLoginAttempts(String name) {
        return loadUserByUsername(name).map(User::decreaseAttempts).orElse(0);
    }

    public void lockUser(String name) {
        loadUserByUsername(name).ifPresent(user -> user.setEnabled(false));
    }

    public void resetRemainingLoginAttempts(String email) {
        loadUserByEmail(email).ifPresent(User::increaseAttempts);
    }
}
