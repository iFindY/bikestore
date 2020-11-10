package de.arkadi.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import de.arkadi.shop.entity.User;

@Transactional
public interface UserRepository extends JpaRepository<User, Long> {

    User findUserByUsername(String name);

    User findUserByEmail(String email);

}
