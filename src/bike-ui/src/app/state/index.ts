import {
    ActionReducer,
    ActionReducerMap,
    MetaReducer
} from '@ngrx/store';
import {routerReducer} from '@ngrx/router-store';
import { userReducer, UserState } from './user/user.reducers';
import { environment } from '../../environments/environment';
import { RouterReducerState } from '@ngrx/router-store/src/reducer';
import { localStorageSync } from 'ngrx-store-localstorage';




export interface AppState {
    router:RouterReducerState
    user: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
    // reducer imported from the state
    router: routerReducer,
    user: userReducer,
};



const reducerKeys = ['user','router'];
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({ keys: reducerKeys, rehydrate: true, storage: sessionStorage })(reducer);
}

export function logger(reducer:ActionReducer<any>)
    : ActionReducer<any> {
    return (state, action) => {
        console.log("state before: ", state);
        console.log("action", action);

        return reducer(state, action);
    }

}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger, localStorageSyncReducer] : [localStorageSyncReducer];






