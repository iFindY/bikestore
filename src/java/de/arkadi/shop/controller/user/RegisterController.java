package de.arkadi.shop.controller.user;

import static de.arkadi.shop.controller.response.Message.MessageBuilder.aMessage;
import static de.arkadi.shop.controller.response.Type.*;
import static java.util.Map.of;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.ResponseEntity.*;

import de.arkadi.shop.controller.response.Message;
import de.arkadi.shop.model.UserRegistrationDTO;
import de.arkadi.shop.repository.UserRepository;
import de.arkadi.shop.security.event.verification.UserRegistrationEvent;
import de.arkadi.shop.services.UserService;
import de.arkadi.shop.services.VerificationService;
import javax.validation.Valid;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;



@RestController
@RequestMapping("/api/user/register")
public class RegisterController {


  private final UserService registrationService;
  private final VerificationService verificationService;
  private final UserRepository userRepository;
  private final ApplicationEventPublisher eventPublisher;

  public RegisterController(UserService registrationService,
      VerificationService verificationService,
      UserRepository userRepository, ApplicationEventPublisher eventPublisher) {
    this.registrationService = registrationService;
    this.verificationService = verificationService;
    this.userRepository = userRepository;
    this.eventPublisher = eventPublisher;
  }


  /**
   * {@link ModelAttribute} binding part of a request body with key = user
   *  <code> @ModelAttribute("user")</code>
   *
   *  {@link RequestBody} binding whole stuff @RequestBody
   */
  @PostMapping()
  public ResponseEntity<Message> register(@RequestBody @Valid UserRegistrationDTO user, BindingResult result) {
    Message message;

    if (result.hasErrors()) { // if disabled resend email and return warning. look at my old project ith bean validation


       message = aMessage()
          .withType(ERROR)
          .withUser(user.getEmail())
          .withMessage("user already exists")
          .build();

      return status(CONFLICT).body(message);

    } else {

      eventPublisher.publishEvent(new UserRegistrationEvent(this.registrationService.registerNewUser(user)));

      message = aMessage()
          .withType(INFO)
          .withUser(user.getEmail())
          .withMessage("user registered successfully")
          .build();

      return status(OK).body(message);
    }
  }

  @GetMapping("/verify/email")
  public RedirectView verifyEmail(@RequestParam String id, RedirectAttributes attributes) {

    verificationService.verifyEmail(id);

    return new RedirectView("http://localhost:4200/");
  }

}
