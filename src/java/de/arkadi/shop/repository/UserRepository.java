package de.arkadi.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import de.arkadi.shop.entity.StoreUser;

public interface UserRepository extends JpaRepository<StoreUser, Long> {

    StoreUser findStoreUserByUsername(String name);

    StoreUser findStoreUserByEmail(String email);

}
