package de.arkadi.shop.services;

import static de.arkadi.shop.entity.Verification.*;

import de.arkadi.shop.entity.User;
import de.arkadi.shop.model.CodeValidationDTO;
import de.arkadi.shop.repository.UserRepository;
import java.util.Optional;

import java.util.function.Predicate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import de.arkadi.shop.entity.Verification;
import de.arkadi.shop.repository.VerificationCodeRepository;

@Service
public class VerificationService {

    private final VerificationCodeRepository verificationRepository;
    private final UserRepository userRepository;

    public VerificationService(VerificationCodeRepository repository,
        PasswordEncoder encoder, UserRepository userRepository) {
        this.verificationRepository = repository;
        this.userRepository = userRepository;
    }

    public void verifyResetCode(CodeValidationDTO codeValidationDTO){
        Predicate<Verification> validCode = v -> v.getCode().equals(codeValidationDTO.getCode());

       verificationRepository.findByEmail(codeValidationDTO.getEmail())
           .filter(validCode)
           .flatMap(userRepository::findUserByVerification)
           .map(User::enable)
           .map(User::getEmail)
           .ifPresent(verificationRepository::deleteByEmail);
    }


    public void verifyEmail(String code) {

        verificationRepository.findUser(code)
            .map(Verification::getEmail)
            .flatMap(userRepository::findUserByMail)
            .ifPresent(user -> {
                user.enable();
                user.activate();
                userRepository.save(user);
                verificationRepository.deleteByEmail(user.getEmail());
            });
    }


    public String createVerification(String mail) {
        return verificationRepository.save(ofVerification(mail)).getCode();
    }

    public String getVerificationCodeByUsername(String mail) {
        return verificationRepository.findByEmail(mail).map(Verification::getCode).orElse(null);
    }

    public Optional<String> getEmailForCode(String code) {
        return verificationRepository.findUser(code).map(Verification::getEmail);
    }

    public void deleteCode(String email) {
        verificationRepository.deleteByEmail(email);
    }


    /// ======================================
    // =               HELPER               =
    // ======================================

    public String createResetCode(String mail) {

        return verificationRepository.save(ofResetCode(mail)).getCode();
    }

}
