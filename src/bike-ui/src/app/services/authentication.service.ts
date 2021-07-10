import { Injectable } from '@angular/core';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../user/user.model';

export const ANONYMOUS_USER: User = {
  username: null,
  roles: []
};


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // need an initial value
  subject = new BehaviorSubject<User>({ roles: null, username: 'Login' }); // wrong male it undefiend
  // when ever we subscribe we get always the last value, filter only invalid users
  user$: Observable<User> = this.subject.asObservable().pipe(filter(user => !!user));
  // derive from user observable, '!!' operator convert to boolean
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user.roles));
  // based on 'login' observable and invert it
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));


  constructor(private http: HttpClient) {
    /**
     * call 'api/user' to get user session on app constructing
     * on start up get possible ACTIVE USER SESSION if exists and is not time outed
     * if active session exists then it will return a user
     */

    // later
   // http.get<User>('api/user').subscribe(user => this.subject.next(user ? user : ANONYMOUS_USER));

  }

  register(email: string, password: string, confirmedPassword: string): Observable<User> {

    /**
     * create post request to create new user, pass in json object with email and password.
     * because the given method variable and the json body property is same we can simplify call.
     * short hand notation is used. this cal returns a 'user' object response.
     *
     * with '.post<User>' we define a return type of the post call.
     *
     * The shareReplay operation force all subclass subscribers (..pipe) share the execution of this observable
     * (replay first execution)
     *
     * if the sign up component fire several times and create several subscription of the observable
     * they will all share result of this blue print body
     * */
    return this.http.post<User>('/api/user/register', {
      email             : btoa(email),
      password          : btoa(password),
      confirmedPassword : btoa(confirmedPassword)})
        .pipe(
            shareReplay(), // this stop multiple request of creating same user
            tap(user => this.subject.next(user))); // emit new values on the BehaviorObject, and hay we know that we work with User objects
  }

  logOut(): Observable<any> {
    return this.http.post('/api/logout/', null)
        .pipe(
            shareReplay(),
            tap(() => this.subject.next(ANONYMOUS_USER))); // update current user to anonymous
  }

  // any is for accessing unknown properties
  login(email: string, password: string): Observable<any> {

    const headers = new HttpHeaders({ 'authentication': btoa(JSON.stringify({ email, password }))});

    return this.http.post<User>('api/auth/login', null, { headers: headers })
        .pipe(
            shareReplay(),
            tap(user => {
              this.subject.next(user);
            }));
  }


}
