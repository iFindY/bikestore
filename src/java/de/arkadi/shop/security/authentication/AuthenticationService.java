package de.arkadi.shop.security.authentication;

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

    public User loadUserByUsername(String name){
        return this.userRepository.findUserByUsername(name);
    }

    public User loadUserByEmail(String email){
        return this.userRepository.findUserByEmail(email);
    }

    public Boolean performAuthenticationChecks(String email) {
        return loadUserByEmail(email).getEnabled();
    }

    public Integer decreaseRemainingLoginAttempts(String name) {
        return loadUserByUsername(name).decreaseAttempts();
    }

    public void lockUser(String name) {
        loadUserByUsername(name).setEnabled(false);
    }

    public void resetRemainingLoginAttempts(String email) {
        loadUserByEmail(email).increaseAttempts();
    }

    public String getAuthority(String name){
        return this.authoritiesRepository.findAuthorityByEmail(name).getAuthority().toString();
    }
}
