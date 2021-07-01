package de.arkadi.shop.controller.user;


import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.status;

import de.arkadi.shop.controller.response.DefaultResponse;
import de.arkadi.shop.model.CodeValidationDTO;
import de.arkadi.shop.model.ResetPasswordDTO;
import de.arkadi.shop.services.UserService;
import de.arkadi.shop.services.VerificationService;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/user/reset")
public class RestPasswordController {


  private final VerificationService verificationService;
  private final UserService userService;

  public RestPasswordController(
      VerificationService verificationService, UserService userService) {

    this.verificationService = verificationService;
    this.userService = userService;
  }


  @PostMapping
  public ResponseEntity<Void> sendResetPassword(@RequestBody String mail) {

    userService.sendResetPasswordMail(mail);

    return status(OK).build();
  }

  @PostMapping("/code/validate")
  public ResponseEntity<Void> validateResetCode(@RequestBody CodeValidationDTO codeValidationDTO) {

    verificationService.verifyResetCode(codeValidationDTO);

    return status(OK).build();
  }

  @PostMapping("/password")
  public ResponseEntity<DefaultResponse> resetPassword(@RequestBody @Valid ResetPasswordDTO reset) {

    userService.resetPassword(reset);

    return status(OK).build();
  }

}
