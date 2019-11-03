import {Component, OnInit} from '@angular/core';
import {BikesService} from "../../service/bikes.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public bikes;

  constructor(private bikesService: BikesService) {
  }

  ngOnInit() {
    console.log("hi arkadi3")

    this.getBikes();
  }

  getBikes() {
    console.log("hi arkadi2")
    this.bikesService.getBikes().subscribe(
      data => {this.bikes = data},
      err => console.error(err),
      () => console.log('bikes loaded')
    )
  }
}
