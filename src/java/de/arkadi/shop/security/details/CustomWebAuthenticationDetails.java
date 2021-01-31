package de.arkadi.shop.security.details;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.web.authentication.WebAuthenticationDetails;

public class CustomWebAuthenticationDetails extends WebAuthenticationDetails {

    public CustomWebAuthenticationDetails(HttpServletRequest request) {
        super(request);
    }

}
