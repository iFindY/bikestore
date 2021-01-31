package de.arkadi.shop;

import javax.persistence.EntityManagerFactory;

import org.hibernate.SessionFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication()
public class ShopApplication implements WebMvcConfigurer {

    public static void main(String[] args) {
        SpringApplication.run(ShopApplication.class, args);
    }


    /**
     * This stuff must be here because they must be initialised first
     *
     * adjust factory to redirect tomcat container from http to https
     * set security constrain to confidential for all requests '/*'
     * Spring boot will use ths been by creating the amended tomcat server
     */

  /*
    @Bean
    public ServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                SecurityConstraint securityConstraint = new SecurityConstraint();

                securityConstraint.setUserConstraint("CONFIDENTIAL");
                SecurityCollection collection = new SecurityCollection();
                collection.addPattern("/*");

                securityConstraint.addCollection(collection);
                context.addConstraint(securityConstraint);
            }
        };
        tomcat.addAdditionalTomcatConnectors(redirectConnector());
        return tomcat;
    }
*/
    /**
     * this is a tomcat connector to redirect http on port 80 to  port 8443
     * where other connector created by spring is listening
     */
    /*

    private Connector redirectConnector() {
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setScheme("http");
        connector.setPort(80);
        connector.setRedirectPort(8443);
        return connector;
    }
*/

    /*
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/ui/index.html");
    }
*/
}
