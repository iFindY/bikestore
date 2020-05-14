package de.arkadi.shop;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.ModelAndView;


import java.util.Collections;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class ShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopApplication.class, args);
    }


    @Bean
    ErrorViewResolver angularRedirect() {
        return (request, status, model) -> status == HttpStatus.NOT_FOUND ? new ModelAndView("/", Collections.emptyMap(), HttpStatus.OK) : null;
    }

}
