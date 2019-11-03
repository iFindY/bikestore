package de.arkadi.shop.repository;

import de.arkadi.shop.model.Bike;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BikeRepository extends JpaRepository<Bike, Long> {
    public Bike getBikeByName(String name);

    public Bike getBikeById(Long id);

}
