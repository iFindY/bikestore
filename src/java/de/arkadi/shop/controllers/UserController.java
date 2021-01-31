package de.arkadi.shop.controllers;

import static java.lang.String.format;
import static java.util.Map.of;

import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.arkadi.shop.model.UserRegistrationDTO;
import de.arkadi.shop.services.UserRegistrationService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRegistrationService registrationService;

    public UserController(UserRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    // @ModelAttribute("user") binding part of a request body  key = user
    // @RequestBody binding whole stuff
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody @Valid UserRegistrationDTO user, BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(of("message", "user already exists", "user", user.getEmail()));
        } else {
            this.registrationService.registerNewUser(user);
            return ResponseEntity.status(HttpStatus.OK).body(of("message", "user registered successfully", "user", user.getEmail()));
        }
    }

}
