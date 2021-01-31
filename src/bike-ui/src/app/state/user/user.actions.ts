import {createAction, props} from '@ngrx/store';
import { Settings, User } from '../../login/login.model';


/**
 * the props argument contain a payload which can be accessed by the reducer.
 * this can be typed with "USER"
 */
export const switchScreen = createAction('[USER] switch screen', props<{ screen }>());
export const hideScreen = createAction('[USER] hide screen');

export const setMessage = createAction('[USER] set message',props<{ message }>());


export const login = createAction('[USER] login', props<{ email, password }>());
export const loginSuccess = createAction('[USER] login success', props<{ user: User }>());
export const logout = createAction('[USER] logout');

export const register = createAction('[USER] register', props<{ email, password, confirmedPassword }>());

export const cleanSettings = createAction('[USER] clean settings');
export const setSettings = createAction('[USER] set settings', props<{ settings: Settings }>());

export const clearState = createAction('[USER] clear state');

