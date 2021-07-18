package de.arkadi.shop.security.authentication;

import static java.util.Optional.ofNullable;

import de.arkadi.shop.model.UserDTO;
import de.arkadi.shop.security.details.AdditionalWebAuthenticationDetails;
import de.arkadi.shop.security.userdetails.CustomUserDetailsService;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;
import org.springframework.stereotype.Component;


@Component
public class AdditionalAuthenticationProvider extends DaoAuthenticationProvider {
    private final AuthenticationService authenticationService;



    public AdditionalAuthenticationProvider(AuthenticationService authenticationService,
        UserDetailsChecker userDetailsChecker,
        CustomUserDetailsService customUserDetailsService,
        MessageSourceAccessor customMessages) {

        super();

        {
             // this.setPasswordEncoder(encoder); default is there
            this.setPreAuthenticationChecks(userDetailsChecker);
            this.setUserDetailsService(customUserDetailsService);
        }
        this.authenticationService = authenticationService;
        this.messages = customMessages;
    }

    /**
     *
     * @param userDetails information about the user from the DB by the {@link CustomUserDetailsService}
     * @param authentication information about the user by the authentication form the WEB
     *
     * called <b>after</b> the username and password is authenticated.
     * here you can add logic to also match the pin or do additional logic like resetting login attempts.
     */
    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication){
        Integer attemptsLeft;

        try {

            /**
             *  the {@link AbstractUserDetailsAuthenticationProvider#additionalAuthenticationChecks}
             *  is abstract and is used inside the {@link AbstractUserDetailsAuthenticationProvider#authenticate}
             *  that's why we have to give an implementation or use the given Dao version
             **/
            super.additionalAuthenticationChecks(userDetails, authentication); // try authenticate

            {  // if you need to match extra field like pin do it here
                AdditionalWebAuthenticationDetails details = (AdditionalWebAuthenticationDetails) authentication.getDetails();
                UserDTO user = (UserDTO) userDetails;

                // if user.getPin !== details.getPin => throw BadCredentialException
            }

            {  // reset attempts if valid
                authenticationService.resetRemainingLoginAttempts(userDetails.getUsername());
            }


        } catch (AuthenticationException e) { // on fail decrease attempts
            ofNullable(authentication.getCredentials()).orElseThrow(() -> e);
            attemptsLeft = this.authenticationService.decreaseRemainingLoginAttempts(authentication.getName());

            if (attemptsLeft == 0) {
                this.authenticationService.lockUser(authentication.getName());
                throw new LockedException("account locked after three false attempts");
            }else if(attemptsLeft>0){
                throw new BadCredentialsException("invalid credentials");
            } else if(attemptsLeft==-1){
                throw new AuthenticationCredentialsNotFoundException("account not found");
            }

        }
    }

}
