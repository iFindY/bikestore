package de.arkadi.shop.security;


import java.util.concurrent.ConcurrentHashMap;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.session.MapSession;
import org.springframework.session.MapSessionRepository;
import org.springframework.session.SessionRepository;
import org.springframework.session.config.annotation.web.http.EnableSpringHttpSession;
import org.springframework.session.web.http.CookieHttpSessionIdResolver;
import org.springframework.session.web.http.DefaultCookieSerializer;


/**
 * By default, Spring Security adds an additional filter in the Spring Security filter chain – which
 * is capable of persisting the Security Context (SecurityContextPersistenceFilter class).
 *
 * In turn, it delegates the persistence of the Security Context to an instance of SecurityContextRepository,
 * defaulting to the HttpSessionSecurityContextRepository class.
 *
 *  {@link MapSessionRepository} uses {@code private final Map<String, Session> sessions;} for the
 * 	auth token mapping to session, this session will be copied to the thread context by the {@link SecurityContextPersistenceFilter}
 */
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
