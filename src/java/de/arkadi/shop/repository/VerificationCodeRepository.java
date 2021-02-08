package de.arkadi.shop.repository;


import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.constraints.NotNull;

import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import de.arkadi.shop.entity.User;
import de.arkadi.shop.entity.Verification;

@Repository
@Transactional
public class VerificationCodeRepository {

    @PersistenceContext
    private EntityManager em;


    public Optional<Verification> findByEmail(@NotNull String mail){
        return getCurrentSession()
                .createNamedQuery("find_verification_by_mail", Verification.class)
                .setParameter("mail", mail)
                .uniqueResultOptional();
    }

    public boolean verificationExists(@NotNull String mail){
        return getCurrentSession()
                .createNamedQuery("find_verification_by_mail", Verification.class)
                .setParameter("mail", mail)
                .uniqueResultOptional()
                .isPresent();
    }

    public Optional<Verification> findUser(@NotNull String code){
        return getCurrentSession()
                .createNamedQuery("find_user_by_code", Verification.class)
                .setParameter("code", code)
                .uniqueResultOptional();
    }

    public Verification save(@NotNull Verification verification) {
        getCurrentSession().persist(verification);
        return verification;
    }

    private Session getCurrentSession() {
        return em.unwrap(Session.class);
    }

}
