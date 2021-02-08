package de.arkadi.shop.security;


import java.util.concurrent.ConcurrentHashMap;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.MapSession;
import org.springframework.session.MapSessionRepository;
import org.springframework.session.SessionRepository;
import org.springframework.session.config.annotation.web.http.EnableSpringHttpSession;
import org.springframework.session.web.http.CookieHttpSessionIdResolver;
import org.springframework.session.web.http.DefaultCookieSerializer;



@Configuration
@EnableSpringHttpSession
public class SessionStoreConfiguration {

    @Bean
    public SessionRepository<MapSession> sessionRepository() {
        MapSessionRepository mapSessionRepository = new MapSessionRepository(new ConcurrentHashMap<>());
        mapSessionRepository.setDefaultMaxInactiveInterval(14400);
        return mapSessionRepository;
    }

    @Bean
    public CookieHttpSessionIdResolver createAuthenticationCookieHttpSessionIdResolver() {
        CookieHttpSessionIdResolver sessionIdResolver = new CookieHttpSessionIdResolver();
        sessionIdResolver.setCookieSerializer(this.getAuthenticationCookieSerializer());
        return sessionIdResolver;
    }

    public DefaultCookieSerializer getAuthenticationCookieSerializer() {
        DefaultCookieSerializer cookieSerializer = new DefaultCookieSerializer();
        cookieSerializer.setCookieName("x-auth-token");
        cookieSerializer.setCookieMaxAge(14400); // 4h in seconds 
        cookieSerializer.setUseHttpOnlyCookie(true);

        return cookieSerializer;
    }

}
