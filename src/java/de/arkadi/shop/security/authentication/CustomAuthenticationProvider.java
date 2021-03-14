package de.arkadi.shop.security.authentication;

import static java.util.Optional.ofNullable;

import de.arkadi.shop.security.userdetails.CustomUserDetailsService;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;
import org.springframework.stereotype.Component;


@Component
public class CustomAuthenticationProvider extends DaoAuthenticationProvider {
    private final AuthenticationService authenticationService;

    public CustomAuthenticationProvider(AuthenticationService authenticationService,
        UserDetailsChecker userDetailsChecker,
        CustomUserDetailsService customUserDetailsService) {

        super();
        {
             // this.setPasswordEncoder(encoder); default is there
            this.setPreAuthenticationChecks(userDetailsChecker);
            this.setUserDetailsService(customUserDetailsService);
        }
        this.authenticationService = authenticationService;
    }

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication){
        Integer attemptsLeft;

        try {
            super.additionalAuthenticationChecks(userDetails, authentication); // try authenticate
            authenticationService.resetRemainingLoginAttempts(userDetails.getUsername()); // reset attempts if valid

        } catch (AuthenticationException e) { // on fail decrease attempts
            ofNullable(authentication.getCredentials()).orElseThrow(() -> e);
            attemptsLeft = this.authenticationService.decreaseRemainingLoginAttempts(authentication.getName());

            if (attemptsLeft == 0) {
                this.authenticationService.lockUser(authentication.getName());
                throw new LockedException("Account Locked after three false attempts");
            }

        }
    }

}
