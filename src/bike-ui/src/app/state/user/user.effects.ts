import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {UserActions} from '../action-types';
import { tap, concatMap, shareReplay, catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../login/login.model';
import { of } from 'rxjs';


@Injectable()
export class UserEffects {


    constructor(private actions$: Actions,
                private router: Router,
                private http: HttpClient) {

    }



    /**
     * catch login action dispatched by the global actions$ observable
     * which is injected in the constructor.
     * And safe the login data in the local storage as a side effect with the "tap" operator.
     * An effect must emit an Action which in this case is dropped by the "dispatch:false" configuration.
     */
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.login),
            concatMap(({ email, password }) => {
                const headers = new HttpHeaders({ 'authentication': btoa(JSON.stringify({ email, password })) });

                return this.http.post<User>('api/auth/login', null, { headers: headers })
                    .pipe(
                        shareReplay(),
                        concatMap(({ name, roles }) => of(
                            UserActions.loginSuccess({ user: { name, roles } }),
                            UserActions.switchScreen({ screen: 'logged-in' }))),
                        catchError(message => of(UserActions.setMessage({ message })))
                    )
            })
        )
    );


   register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.register),
            concatMap(({ email, password, confirmedPassword }) => {

                return this.http.post<User>('api/user/register', { email, password, confirmedPassword })
                    .pipe(
                        shareReplay(),
                        concatMap(({ name, roles }) => of(
                            UserActions.loginSuccess({ user: { name, roles } }),
                            UserActions.switchScreen({ screen: 'registered' }))),
                        catchError(message => of(UserActions.setMessage({ message })))
                    )
            })
        )
    );



}
