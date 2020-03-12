import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable()
export class BikesService {

  constructor(private http: HttpClient) {
  }

  getBikes() {
    console.log("hi arkadi");
    return this.http.get('api/bikes')
  }
}
