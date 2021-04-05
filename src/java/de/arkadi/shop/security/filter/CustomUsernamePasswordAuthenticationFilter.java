package de.arkadi.shop.security.filter;

import static java.util.Optional.ofNullable;

import java.util.Base64;
import java.util.function.Function;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

public class CustomUsernamePasswordAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    public CustomUsernamePasswordAuthenticationFilter() {
        super(new AntPathRequestMatcher("/login", "POST"));
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        String email = obtainUsername(request),
            password = obtainPassword(request);

        UsernamePasswordAuthenticationToken authRequest =
            new UsernamePasswordAuthenticationToken(email, password); // wrapper for password and username

        return this.getAuthenticationManager().authenticate(authRequest);
    }


    public String obtainUsername(HttpServletRequest request) {

        return ofNullable(request.getHeader("authentication"))
                .map(decodeBase64)
                .map(String::new)
                .map(JSONObject::new)
                .map(getUsername)
                .orElse(request.getParameter("email")); // if login data is not in header
    }

    public String obtainPassword(HttpServletRequest request) {

        return ofNullable(request.getHeader("authentication"))
                .map(decodeBase64)
                .map(String::new)
                .map(JSONObject::new)
                .map(getPassword)
                .orElse(request.getParameter("password")); // if login data is not in header
    }


    private final Function<String, byte[]> decodeBase64 = auth -> Base64.getDecoder().decode(auth);

    private final Function<JSONObject, String> getPassword = json -> json.getString("password").trim();
    private final Function<JSONObject, String> getUsername = json -> json.getString("email").trim();
}
