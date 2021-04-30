package de.arkadi.shop.security.details;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.web.authentication.WebAuthenticationDetails;

/**
 *  additional details for authentication are placed here and are
 */
public class AdditionalWebAuthenticationDetails extends WebAuthenticationDetails {

    private final String pin;

    public AdditionalWebAuthenticationDetails(HttpServletRequest requestContext) {
        super(requestContext);
        pin = requestContext.getParameter("pin");
    }

    public String getPin() {
        return pin;
    }
}
