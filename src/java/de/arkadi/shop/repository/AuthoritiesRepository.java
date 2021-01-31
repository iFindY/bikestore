package de.arkadi.shop.repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.validation.constraints.NotNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import de.arkadi.shop.entity.Authority;

@Repository
@Transactional
public class AuthoritiesRepository {

    @PersistenceContext
    private EntityManager em;

    public Authority findAuthorityByEmail(@NotNull String mail) {
        TypedQuery<Authority> query = em
                .createQuery("SELECT auth FROM Authority auth WHERE auth.email = :mail", Authority.class)
                .setParameter("mail", mail);

        return query.getResultStream().findFirst().orElse(null);
    }


    public Authority save(@NotNull Authority authority) {
        em.persist(authority);
        return authority;
    }

}
