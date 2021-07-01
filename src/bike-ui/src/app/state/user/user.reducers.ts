import { createReducer, on } from '@ngrx/store';
import { UserActions } from '../action-types';
import { LoginScreen, Settings, User } from '../../login/login.model';

/**
 * reducer defines application state object.
 * this interface definition the auth sub state with only one property => user
 */
export interface UserState {
    user: User
    settings: Settings
    screen: LoginScreen
    loading:{login:boolean,reset:boolean}
    message:string
}

export const initialUserState: UserState = {
    user: undefined,
    settings:undefined,
    screen: 'login',
    loading: {login:false,reset:false},
    message:undefined
}

/**
 * only one reducer per (sub)state with different reduce function.
 * those depends on the caught action type.
 * the reducer need an initial state which is null in this case.
 * The reduce functions takes the current state of "AuthState" and the "action" with optional payload.
 * The function returns a new state which implements the "AuthState",
 * in this case a simple user state.
 * The state name is defined int the module under StoreModule.forFeature('auth', authReducer).
 */
export const userReducer = createReducer<UserState>(
    initialUserState,
    on(UserActions.setMessage, (state, {message}) => ({
        ...state, message
    })),
    on(UserActions.switchScreen, (state, {screen}) => ({
        ...state, screen
    })),
    on(UserActions.loading, (state, {loading}) => ({
        ...state, loading
    })),
    on(UserActions.loginSuccess, (state, {user}) => ({
        ...state, user
    })),
    on(UserActions.logout, (state,) => ({
        ...state, user: null, screen:'login'
    })),
    on(UserActions.setSettings, (state, { settings }) => ({
        ...state, settings
    })),
    on(UserActions.cleanSettings, (state,) => ({
        ...state, settings: null
    })),
    on(UserActions.clearState, () => ({
        ...initialUserState
    })),
);

