package de.arkadi.shop.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsChecker;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import de.arkadi.shop.security.authentication.AuthenticationService;
import de.arkadi.shop.security.handler.CustomAuthenticationEntryPoint;
import de.arkadi.shop.security.authentication.CustomAuthenticationProvider;
import de.arkadi.shop.security.filter.CustomUsernamePasswordAuthenticationFilter;
import de.arkadi.shop.security.details.CustomWebAuthenticationDetailsSource;
import de.arkadi.shop.security.handler.CustomAuthenticationFailureHandler;
import de.arkadi.shop.security.handler.CustomAuthenticationSuccessHandler;
import de.arkadi.shop.security.userdetails.CustomUserDetailsChecker;
import de.arkadi.shop.security.userdetails.CustomUserDetailsService;

/**
 *  By extending this adapter we crete a filter chain.
 *  If it is the only one no matcher needed, otherwise
 *  hast to start with http.antMatcher("/admin/") prefix
 */
@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final CustomUserDetailsService customUserDetailsService;
    private final AuthenticationService authenticationService;

    public SecurityConfiguration(CustomUserDetailsService customUserDetailsService,
            AuthenticationService authenticationService) {

        this.customUserDetailsService = customUserDetailsService;
        this.authenticationService = authenticationService;
    }

    /**
     * One of three main configure Method! Web-Security
     * set url pattern for any url pattern which will be completely ignored by spring security.
     **
     * Here are routes defined which wil not be secured at all.
     */
    @Override
    public void configure(WebSecurity web) {
        web.ignoring().antMatchers("**/static/**");
    }


    /**
     *  In this Method you can define all authorisation rules
     *  which spring security should apply.
     *
     *  The http parameter allow to define security constrains
     *  to the url patterns appearing in the browser.
     *
     *  You can define intercept url-patterns which wil be intercepted
     *  and perform authentication checks of the request principle.
     *
     *  The matchers are always a part of a filter which decides what to do.
     *  You can define extra filters in the filter chain,with own matchers.
     *
     *  the fluent api try to mimic xml structure
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
     // @formatter:off
        http
            .addFilterBefore(authenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .formLogin()
                .authenticationDetailsSource(new CustomWebAuthenticationDetailsSource())
                .loginProcessingUrl("/api/auth/login")
                .successHandler(getAuthenticationSuccessHandler())
                .failureHandler(getAuthenticationFailureHandler()).and()

            .logout()
                .logoutUrl("/api/auth/logout")
                .invalidateHttpSession(true)
                .deleteCookies("x-auth-token", "XSRF-TOKEN").and()

            .exceptionHandling()
                .authenticationEntryPoint(getUnauthorizedEntryPoint()).and()

            .authorizeRequests()
                // the request equals "/" as allowed for all
                .antMatchers("/").permitAll()
                // any request which has not ben intercepted previously, has to be authenticated
                .anyRequest().authenticated().and()

            .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()).and()

            .headers()
                .contentSecurityPolicy("script-src 'self'");
     // @formatter:on
    }


    /**
     * configure Authentications Manager and datasource.
     *
     * you can define own user details service implementing UserDetailsService
     * which will be automatically wired in by sprig to get user credentials in
     * the AuthenticationManger
     */
    @Override
    public void configure(AuthenticationManagerBuilder auth){

        UserDetailsChecker userDetailsChecker = new CustomUserDetailsChecker(this.authenticationService);
        CustomAuthenticationProvider authenticationProvider = new CustomAuthenticationProvider(this.authenticationService, userDetailsChecker);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        authenticationProvider.setUserDetailsService(this.customUserDetailsService);
        auth.authenticationProvider(authenticationProvider);
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }


    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public CustomAuthenticationSuccessHandler getAuthenticationSuccessHandler() {
        return new CustomAuthenticationSuccessHandler();
    }

    @Bean
    public SimpleUrlAuthenticationFailureHandler getAuthenticationFailureHandler() {
        return new CustomAuthenticationFailureHandler();
    }

    @Bean
    public CustomAuthenticationEntryPoint getUnauthorizedEntryPoint() {
        return new CustomAuthenticationEntryPoint();
    }


    private CustomUsernamePasswordAuthenticationFilter authenticationFilter() throws Exception {
        CustomUsernamePasswordAuthenticationFilter filter = new CustomUsernamePasswordAuthenticationFilter();
        filter.setAuthenticationManager(authenticationManagerBean());
        filter.setAuthenticationSuccessHandler(getAuthenticationSuccessHandler());
        filter.setAuthenticationFailureHandler(getAuthenticationFailureHandler());
        filter.setAuthenticationDetailsSource(new CustomWebAuthenticationDetailsSource());
        filter.setFilterProcessesUrl("/api/auth/login");
        return filter;
    }

}
