package de.arkadi.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import de.arkadi.shop.model.StoreUser;

public interface UserRepository extends JpaRepository<StoreUser, Long> {

    StoreUser getUserByUsername(String name);

}
