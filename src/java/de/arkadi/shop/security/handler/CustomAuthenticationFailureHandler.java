package de.arkadi.shop.security.handler;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

public class CustomAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
            throws IOException, ServletException {
        // TODO sendError do not set desired message, investigate filter chain overwrite point
        response.setStatus(UNAUTHORIZED.value(), exception.getMessage());
        super.onAuthenticationFailure(request, response, exception);
    }


}
