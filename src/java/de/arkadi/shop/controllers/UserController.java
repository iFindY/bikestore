package de.arkadi.shop.controllers;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.arkadi.shop.model.UserRegistrationDTO;
import de.arkadi.shop.services.UserRegistrationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserRegistrationService registrationService;

    // @ModelAttribute("user") binding part of a request body  key = user
    // @RequestBody binding whole stuff
    @PostMapping("/register")
    public ResponseEntity<String> register( @RequestBody @Valid UserRegistrationDTO user, BindingResult result) {

        if (result.hasErrors()) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body("user already exists");
        } else {

            this.registrationService.registerNewUser(user);
            return ResponseEntity.ok("user registered successfully");
        }

    }

}
