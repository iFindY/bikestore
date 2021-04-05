package de.arkadi.shop.controllers;

import static java.util.Map.of;
import static java.util.stream.Collectors.toSet;

import de.arkadi.shop.entity.User;
import de.arkadi.shop.model.UserDTO;
import de.arkadi.shop.model.UserRegistrationDTO;
import de.arkadi.shop.repository.UserRepository;
import de.arkadi.shop.security.event.UserRegistrationEvent;
import de.arkadi.shop.security.handler.CustomAuthenticationSuccessHandler;
import de.arkadi.shop.services.UserRegistrationService;
import de.arkadi.shop.services.VerificationService;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/user")
public class UserController {

  private final UserRegistrationService registrationService;
  private final VerificationService verificationService;
  private final UserRepository userRepository;
  private final ApplicationEventPublisher eventPublisher;

  public UserController(UserRegistrationService registrationService,
      VerificationService verificationService,
      UserRepository userRepository, ApplicationEventPublisher eventPublisher) {
    this.registrationService = registrationService;
    this.verificationService = verificationService;
    this.userRepository = userRepository;
    this.eventPublisher = eventPublisher;
  }


  /**
   * redirected here from {@link CustomAuthenticationSuccessHandler}
   */
  @GetMapping("/info")
  public ResponseEntity<Map> getAuthenticatedUserInfo() {
    UserDTO principal = (UserDTO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Set<String> authorities = principal.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(toSet());

    return ResponseEntity.ok(of("name", principal.getUsername(), "roles", authorities));
  }


  /**
   * {@link ModelAttribute} binding part of a request body with key = user
   *  <code> @ModelAttribute("user")</code>
   *
   *  {@link RequestBody} binding whole stuff @RequestBody
   */
  @PostMapping("/register")
  public ResponseEntity<Map<String, String>> register(@RequestBody @Valid UserRegistrationDTO user,
      BindingResult result) {

    if (result.hasErrors()) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(of("message", "user already exists", "user", user.getEmail()));
    } else {
      eventPublisher
          .publishEvent(new UserRegistrationEvent(this.registrationService.registerNewUser(user)));

      return ResponseEntity.status(HttpStatus.OK)
          .body(of("message", "user registered successfully", "user", user.getEmail()));
    }
  }

  @GetMapping("/verify/email")
  public RedirectView verifyEmail(@RequestParam String id, RedirectAttributes attributes) {

    Optional<User> user = verificationService
        .getEmailForCode(id)
        .flatMap(userRepository::findUserByMail);

    if (user.isPresent()) {
      user.get().setEnabled(true);
      userRepository.save(user.get());
      verificationService.deleteCode(user.get().getEmail());
      attributes.addAttribute("user", user.get().getEmail());
    }

    // redirect to user info ?

    return new RedirectView("http://localhost:4200/");
  }

}
