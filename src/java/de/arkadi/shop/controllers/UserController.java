package de.arkadi.shop.controllers;

import static java.lang.String.format;
import static java.util.Map.*;
import static java.util.Map.of;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.coyote.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.arkadi.shop.entity.User;
import de.arkadi.shop.model.UserRegistrationDTO;
import de.arkadi.shop.repository.UserRepository;
import de.arkadi.shop.security.event.UserRegistrationEvent;
import de.arkadi.shop.services.UserRegistrationService;
import de.arkadi.shop.services.VerificationService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRegistrationService registrationService;
    private final VerificationService verificationService;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public UserController(UserRegistrationService registrationService, VerificationService verificationService,
            UserRepository userRepository, ApplicationEventPublisher eventPublisher) {
        this.registrationService = registrationService;
        this.verificationService = verificationService;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }



    @GetMapping("/info")
    public ResponseEntity<Map> register() {
        UserDetails principal = (UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Set<String> authorities = principal.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());

        return ResponseEntity.ok(of("name", principal.getUsername(), "roles", authorities));
    }




    /* @ModelAttribute("user") binding part of a request body  key = user
      @RequestBody binding whole stuff */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody @Valid UserRegistrationDTO user, BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(of("message", "user already exists", "user", user.getEmail()));
        } else {
            eventPublisher.publishEvent(new UserRegistrationEvent(this.registrationService.registerNewUser(user)));

            return ResponseEntity.status(HttpStatus.OK).body(of("message", "user registered successfully", "user", user.getEmail()));
        }
    }

    @GetMapping("/verify/email")
    public String verifyEmail(@RequestParam String code) {
       verificationService
               .getEmailForCode(code)
               .flatMap(userRepository::findUserByMail)
               .ifPresent(user -> {
                   user.setEnabled(true);
                   userRepository.save(user);
               });

        return "redirect:/login-verified"; // redirect from email address
    }

}
