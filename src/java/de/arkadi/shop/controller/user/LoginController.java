package de.arkadi.shop.controller.user;

import static de.arkadi.shop.controller.response.model.Message.MessageBuilder.aMessage;
import static java.util.stream.Collectors.toSet;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.ResponseEntity.*;

import de.arkadi.shop.controller.response.model.Message;
import de.arkadi.shop.model.UserDTO;
import de.arkadi.shop.security.handler.CustomAuthenticationSuccessHandler;
import java.util.Set;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/info")
public class LoginController {


  /**
   * redirected here from {@link CustomAuthenticationSuccessHandler}
   */
  @GetMapping()
  public ResponseEntity<Message> getAuthenticatedUserInfo(@AuthenticationPrincipal UserDTO principal) {

    Set<String> authorities = principal.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(toSet());

    Message message = aMessage()
        .withUser(principal.getUsername())
        .withRoles(authorities)
        .build();


    return status(OK).body(message);
  }

}
