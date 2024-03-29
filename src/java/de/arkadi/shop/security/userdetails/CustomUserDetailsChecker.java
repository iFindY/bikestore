package de.arkadi.shop.security.userdetails;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;

import de.arkadi.shop.security.authentication.AuthenticationService;
import org.springframework.stereotype.Component;

@Component
public class CustomUserDetailsChecker implements UserDetailsChecker {

    AuthenticationService authenticationService;

    public CustomUserDetailsChecker(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    public void check(UserDetails userDetails) { // check if login should process further

        boolean enabled = this.authenticationService.performAuthenticationChecks(userDetails.getUsername());

        if (!enabled) {
            throw new DisabledException("user is not enabled");
        }

    }

}
