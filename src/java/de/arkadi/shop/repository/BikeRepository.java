package de.arkadi.shop.repository;

import de.arkadi.shop.entity.Bike;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BikeRepository extends JpaRepository<Bike, Long> {

    Bike getBikeByName(String name);

    Bike getBikeById(Long id);

}
