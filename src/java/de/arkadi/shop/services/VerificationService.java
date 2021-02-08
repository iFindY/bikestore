package de.arkadi.shop.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import de.arkadi.shop.entity.Verification;
import de.arkadi.shop.repository.VerificationCodeRepository;

@Service
public class VerificationService {

    private final VerificationCodeRepository repository;

    public VerificationService(VerificationCodeRepository repository) {
        this.repository = repository;
    }

    public String createVerification(String mail) {

        if (!repository.verificationExists(mail)) {
            Verification verification = new Verification(mail);
            verification = repository.save(verification);
            return verification.getCode();
        }
        return getVerificationCodeByUsername(mail);
    }

    public String getVerificationCodeByUsername(String mail) {
        return repository.findByEmail(mail).map(Verification::getCode).orElse(null);
    }

    public Optional<String> getEmailForCode(String code) {
        return repository.findUser(code).map(Verification::getEmail);
    }

}
