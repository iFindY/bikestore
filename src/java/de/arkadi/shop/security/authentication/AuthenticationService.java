package de.arkadi.shop.security.authentication;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.arkadi.shop.entity.User;
import de.arkadi.shop.repository.AuthoritiesRepository;
import de.arkadi.shop.repository.UserRepository;

/**
 * do provide access to user data
 */
@Service
@Transactional
public class AuthenticationService {

    private final UserRepository userRepository;
    private final AuthoritiesRepository authoritiesRepository;

    public AuthenticationService(UserRepository userRepository, AuthoritiesRepository authoritiesRepository) {
        this.userRepository = userRepository;
        this.authoritiesRepository = authoritiesRepository;
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

    public String getAuthority(String mail){
        return this.authoritiesRepository.findAuthorityByEmail(mail).getAuthority().toString();
    }
}
