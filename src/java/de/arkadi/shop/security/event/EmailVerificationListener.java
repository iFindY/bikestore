package de.arkadi.shop.security.event;

import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import de.arkadi.shop.services.VerificationService;

@Service
public class EmailVerificationListener implements ApplicationListener<UserRegistrationEvent> {

    private final JavaMailSender mailSender;
    private final VerificationService verificationService;

    public EmailVerificationListener(JavaMailSender mailSender, VerificationService verificationService) {
        this.mailSender = mailSender;
        this.verificationService = verificationService;
    }


    @Override
    public void onApplicationEvent(UserRegistrationEvent event) {
        String email = event.user.getEmail();
        String verificationID= verificationService.createVerification(email);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject("Verify your account");
        message.setText("Account activation link : https://localhost:8443/api/user/verify/email?id="+verificationID);
        message.setTo(email);
        mailSender.send(message);
    }

}
