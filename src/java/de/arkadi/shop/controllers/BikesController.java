package de.arkadi.shop.controllers;

import de.arkadi.shop.model.Bike;
import de.arkadi.shop.repository.BikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;


@RestController
@RequestMapping("/api/bikes")
public class BikesController {

    @Autowired
    BikeRepository bikeRepository;


    @GetMapping
    public List<Bike> list() {
        return bikeRepository.findAll();

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Bike> create(@RequestBody Bike bike) throws URISyntaxException {
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
