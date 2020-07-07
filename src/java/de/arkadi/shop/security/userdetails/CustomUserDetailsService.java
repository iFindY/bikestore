package de.arkadi.shop.security.userdetails;

import static java.util.Optional.ofNullable;
import static org.slf4j.LoggerFactory.*;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.User;



import org.slf4j.Logger;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import de.arkadi.shop.entity.StoreUser;
import de.arkadi.shop.security.authentication.AuthenticationService;

/**
 * It is used throughout the framework as a user DAO and is the strategy.
 * This service is plugged in, into the {@link AuthenticationManager}, which will use
 * this {@link CustomUserDetailsService} to retrieve user credentials.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final Logger logger = getLogger(this.getClass());

    private final AuthenticationService authenticationService;

    public CustomUserDetailsService(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    /**
     * Locates the user based on the username.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String authority;
        StoreUser user;

        try {
            user = ofNullable(this.authenticationService.loadUserByUsername(username))
                    .orElseThrow(() -> new UsernameNotFoundException(username));

            authority = this.authenticationService.getAuthority(user.getUsername());

            return User.withUsername(user.getUsername())
                    .password(user.getPassword())
                    .roles(authority)
                    .build();

        } catch (Exception e) {
            logger.error("Username not found [" + username + "]!");

            UsernameNotFoundException ex =  new UsernameNotFoundException("Login denied.", e);
            ex.addSuppressed(e);
            throw ex;
        }
    }

}