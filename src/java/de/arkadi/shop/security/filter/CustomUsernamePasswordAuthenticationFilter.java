package de.arkadi.shop.security.filter;

import static java.util.Base64.getDecoder;
import static java.util.Optional.ofNullable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class CustomUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        UsernamePasswordAuthenticationToken authRequest = getAuthRequest(request);
        setDetails(request, authRequest);
        return this.getAuthenticationManager().authenticate(authRequest);
    }

    private UsernamePasswordAuthenticationToken getAuthRequest(HttpServletRequest request) {
        String username = obtainUsername(request);
        String password = obtainPassword(request);

        return new UsernamePasswordAuthenticationToken(username, password);
    }

    @Override
    public String obtainUsername(HttpServletRequest request) {

        return ofNullable(request.getHeader("Authentication"))
                .map(auth-> getDecoder().decode(auth))
                .map(String::new)
                .map(val -> { try { return new JSONObject(val); } catch (JSONException e) { return new JSONObject(); }})
                .map(json-> { try { return json.getString("username"); } catch (JSONException e) { return ""; } })
                .orElse(request.getParameter("username"));
    }

    @Override
    public String obtainPassword(HttpServletRequest request) {

        return ofNullable(request.getHeader("Authentication"))
                .map(auth-> getDecoder().decode(auth))
                .map(String::new)
                .map(val -> { try { return new JSONObject(val); } catch (Exception e) { return new JSONObject(); }})
                .map(json-> { try { return json.getString("password"); } catch (Exception e) { return ""; } })
                .orElse(request.getParameter("password"));
    }

}
