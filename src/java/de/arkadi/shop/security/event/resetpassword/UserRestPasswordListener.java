package de.arkadi.shop.security.event.resetpassword;

import de.arkadi.shop.services.VerificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class UserRestPasswordListener implements ApplicationListener<UserRestPasswordEvent> {

    private Logger logger = LoggerFactory.getLogger(UserRestPasswordListener.class);
    private final JavaMailSender mailSender;
    private final VerificationService verificationService;

    public UserRestPasswordListener(JavaMailSender mailSender, VerificationService verificationService) {
        this.mailSender = mailSender;
        this.verificationService = verificationService;
    }



    @Override
    public void onApplicationEvent(UserRestPasswordEvent event) {
        String email = event.user.getEmail();
        SimpleMailMessage message = new SimpleMailMessage();
        String code = verificationService.createResetCode(email);

        message.setSubject("Reset Password Link");
        message.setText("Reset password code: "+code);

        message.setTo(email);
        mailSender.send(message);
        logger.info("email send to: "+email);
    }

}
