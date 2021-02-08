package de.arkadi.shop.repository;


import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.constraints.NotNull;

import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import de.arkadi.shop.entity.User;

@Repository
@Transactional
public class UserRepository {

    @PersistenceContext
    private EntityManager em;


    public Optional<User> findUserByMail(@NotNull String mail) {
        return getCurrentSession()
                .createNamedQuery("find_user_by_mail", User.class)
                .setParameter("mail", mail)
                .uniqueResultOptional();
    }

    public Optional<User> findUserByName(@NotNull String name) {
        return getCurrentSession()
                .createNamedQuery("find_user_by_name", User.class)
                .setParameter("name", name)
                .uniqueResultOptional();
    }

    public User save(@NotNull User user) {
        getCurrentSession().persist(user);
        return user;
    }


    private Session getCurrentSession() {
        return em.unwrap(org.hibernate.Session.class);
    }

}
