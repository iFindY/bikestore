import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {UserActions} from '../action-types';
import {concatMap, shareReplay, catchError, delay} from 'rxjs/operators';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../login/login.model';
import { of } from 'rxjs';
import {Store} from "@ngrx/store";
import {UserState} from "./user.reducers";


@Injectable()
export class UserEffects {


    constructor(private actions$: Actions,
                private router: Router,
                private http: HttpClient,
                private store$:Store<UserState>) {

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
                this.store$.dispatch(UserActions.loading({ loading: true}));

                return this.http.post<User>('api/auth/login', null, { headers: headers })
                    .pipe(
                        shareReplay(),
                        concatMap(({ name, roles }) => of(
                            UserActions.loading({ loading: false}),
                            UserActions.loginSuccess({ user: { name, roles } }),
                            UserActions.switchScreen({ screen: 'logged-in' }))),
                        catchError(message => of(
                            UserActions.loading({ loading: false}),
                            UserActions.setMessage({ message }))),
                        delay(1500)
                    )
            })
        )
    );


   register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.register),
            concatMap(({ email, password, confirmedPassword }) => {
              this.store$.dispatch(UserActions.loading({ loading: true}))

                return this.http.post<User>('api/user/register', { email, password, confirmedPassword })
                    .pipe(
                        shareReplay(),
                        concatMap(({ name, roles }) => of(
                            UserActions.loading({ loading: false}),
                            UserActions.switchScreen({ screen: 'registered' }),
                            UserActions.setMessage({message: null}))),
                        catchError(({error: {message, user}}) => of(
                            UserActions.loading({loading: false}),
                            UserActions.setMessage({message}))
                        )
                    )
            })
        )
    );



}
