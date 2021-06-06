import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {UserActions} from '../action-types';
import {concatMap, shareReplay, catchError, delay, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../login/login.model';
import { of } from 'rxjs';
import { Store} from "@ngrx/store";
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
                        concatMap(({ username, roles }) => of(
                            UserActions.loading({ loading: false}),
                            UserActions.loginSuccess({ user: { username, roles } }),
                            UserActions.switchScreen({ screen: 'logged-in' }))),
                        catchError(({statusText}) => of(
                            UserActions.loading({ loading: false}),
                            UserActions.setMessage({message: statusText}))),
                        delay(1500))}))
    );


   register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.register),
            concatMap(({ email, password, confirmedPassword }) => {
              this.store$.dispatch(UserActions.loading({ loading: true}))

                return this.http.post<User>('api/user/register', { email, password, confirmedPassword })
                    .pipe(
                        shareReplay(),
                        concatMap(({ username, roles }) => of(
                            UserActions.loading({ loading: false}),
                            UserActions.switchScreen({ screen: 'registered' }),
                            UserActions.setMessage({message: null}))),
                        catchError(({error: {message}}) => of(
                            UserActions.loading({loading: false}),
                            UserActions.setMessage({message}))))}))
   );


  logout$ = createEffect(() =>
          this.actions$.pipe(
              ofType(UserActions.logout),
              concatMap(() => this.http.post('api/auth/logout', null).pipe(tap(() => localStorage.clear())))
          ), { dispatch: false }
  );


  status$ = createEffect(() =>
      this.actions$.pipe(
          ofType(UserActions.userStatus),
          concatMap(() => this.http.get<User>('api/user/info').pipe(
              concatMap(({ username, roles
              }) => of(UserActions.loginSuccess({ user: { username, roles } }))),
              catchError(() => of(UserActions.logout())))))
  );


  get_reset$ = createEffect(() =>
      this.actions$.pipe(
          ofType(UserActions.getResetCode),
          shareReplay(),
          concatMap(({email}) => this.http.post<any>('api/user/reset', email).pipe(
              concatMap(() => of(
                  UserActions.getResetCodeSuccess(),
                  UserActions.switchScreen({ screen: 'code' }))),
              catchError(({error: {message}}) => of(UserActions.setMessage({message}))))))
  );

  validate_reset_code$ = createEffect(() =>
      this.actions$.pipe(
          ofType(UserActions.validateResetCode),
          shareReplay(),
          concatMap(({code,email}) => this.http.post<any>('api/user/reset/code/validate',{code,email}).pipe(
              concatMap(() => of(
                  UserActions.validateResetCodeSuccess(),
                  UserActions.switchScreen({ screen: 'password' }))),
              catchError(({error: {message}}) => of(UserActions.setMessage({message}))))))
  );


  reset_password$ = createEffect(() =>
      this.actions$.pipe(
          ofType(UserActions.resetPassword),
          shareReplay(),
          concatMap(({email, newPassword,confirmedPassword}) => this.http.post<any>('api/user/reset/password', { email, newPassword, confirmedPassword }).pipe(
              concatMap(() => of(
                  UserActions.resetPasswordSuccess(),
                  UserActions.switchScreen({screen: 'done'}))),
              catchError(({error: {message}}) => of(UserActions.setMessage({message}))))))
  );


}
