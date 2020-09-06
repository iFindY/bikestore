package de.arkadi.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import de.arkadi.shop.entity.Authority;

public interface AuthoritiesRepository extends JpaRepository<Authority, Long> {

    Authority findAuthorityByEmail(String email);

}
