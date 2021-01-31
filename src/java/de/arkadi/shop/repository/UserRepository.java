package de.arkadi.shop.repository;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.validation.constraints.NotNull;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import de.arkadi.shop.entity.User;

@Repository
@Transactional
public class UserRepository {

    @PersistenceContext
    private EntityManager em;



    public User findUserByMail(@NotNull String mail) {
        TypedQuery<User> query = em
                .createQuery("SELECT user FROM User user WHERE user.email = :mail", User.class)
                .setParameter("mail", mail);

        return query.getResultStream().findFirst().orElse(null);
    }

    public User findUserByName(@NotNull String name) {
        TypedQuery<User> query = em
                .createQuery("SELECT user FROM User user WHERE user.username = :name", User.class)
                .setParameter("name", name);

        return query.getResultStream().findFirst().orElse(null);
    }

    public User save(@NotNull User user) {
        em.persist(user);
        return user;
    }

}
