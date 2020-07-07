package de.arkadi.shop.security.authentication;

import org.springframework.stereotype.Service;

import de.arkadi.shop.entity.StoreUser;
import de.arkadi.shop.repository.AuthoritiesRepository;
import de.arkadi.shop.repository.UserRepository;

/**
 * do provide access to user data
 */
@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final AuthoritiesRepository authoritiesRepository;

    public AuthenticationService(UserRepository userRepository, AuthoritiesRepository authoritiesRepository) {
        this.userRepository = userRepository;
        this.authoritiesRepository = authoritiesRepository;
    }

    public StoreUser loadUserByUsername(String name){
        return this.userRepository.findStoreUserByUsername(name);
    }


    public Boolean performAuthenticationChecks(String name) {
        return loadUserByUsername(name).getEnabled();
    }

    public Integer decreaseRemainingLoginAttempts(String name) {
        return loadUserByUsername(name).decreaseAttempts();
    }

    public void resetRemainingLoginAttempts(String name) {
        loadUserByUsername(name).increaseAttempts();
    }

    public String getAuthority(String name){
        return this.authoritiesRepository.findAuthorityByUsername(name).getAuthority();
    }
}
