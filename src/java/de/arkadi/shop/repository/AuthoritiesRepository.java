package de.arkadi.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import de.arkadi.shop.entity.Authority;

@Transactional
public interface AuthoritiesRepository extends JpaRepository<Authority, Long> {

    Authority findAuthorityByEmail(String email);

}
