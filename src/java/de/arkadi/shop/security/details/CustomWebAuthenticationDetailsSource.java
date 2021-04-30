package de.arkadi.shop.security.details;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

/**
 * build the custom authentication object
 */
public class CustomWebAuthenticationDetailsSource extends WebAuthenticationDetailsSource {

    /**
     * called by a class when it wishes a new authentication details instance to be created,
     * called while authentication process by {@link AbstractPreAuthenticatedProcessingFilter#doAuthenticate }
     */
    @Override
    public AdditionalWebAuthenticationDetails buildDetails(HttpServletRequest requestContext) {
        return new AdditionalWebAuthenticationDetails(requestContext);
    }
}
