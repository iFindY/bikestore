package de.arkadi.shop.repository;


import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.constraints.NotNull;

import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import de.arkadi.shop.entity.UserDBO;

@Repository
@Transactional
public class UserRepository {

    @PersistenceContext
    private EntityManager em;


    public Optional<UserDBO> findUserByMail(@NotNull String mail) {
        return getCurrentSession()
                .createNamedQuery("find_user_by_mail", UserDBO.class)
                .setParameter("mail", mail)
                .uniqueResultOptional();
    }

    public Optional<UserDBO>  findUserByName(@NotNull String name) {
        return getCurrentSession()
                .createNamedQuery("find_user_by_name", UserDBO.class)
                .setParameter("name", name)
                .uniqueResultOptional();
    }

    public UserDBO save(@NotNull UserDBO user) {
        getCurrentSession().persist(user);
        return user;
    }


    private Session getCurrentSession() {
        return em.unwrap(org.hibernate.Session.class);
    }

}
