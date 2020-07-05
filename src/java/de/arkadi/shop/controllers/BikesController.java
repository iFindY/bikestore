package de.arkadi.shop.controllers;

import de.arkadi.shop.entity.Bike;
import de.arkadi.shop.repository.BikeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;


@RestController
@RequestMapping("/api/bikes")
public class BikesController {

    final BikeRepository bikeRepository;

    public BikesController(BikeRepository bikeRepository) {
        this.bikeRepository = bikeRepository;
    }

    @GetMapping
    public List<Bike> list() {
        return bikeRepository.findAll();

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Bike> create(@RequestBody Bike bike) {
        String id = bikeRepository.save(bike).getId().toString();
        return ResponseEntity
                .created(URI.create("http://localhost/api/bikes/".concat(id)))
                .build();
    }

    @GetMapping("/{id}")
    public Bike get(@PathVariable("id") Long id) {
        return bikeRepository.getBikeById(id);
    }

}
