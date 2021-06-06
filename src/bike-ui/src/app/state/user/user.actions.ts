import {createAction, props} from '@ngrx/store';
import { Settings, User} from '../../login/login.model';


/**
 * the props argument contain a payload which can be accessed by the reducer.
 * this can be typed with "USER"
 */
export const switchScreen = createAction('[USER] switch screen', props<{ screen }>());
export const userStatus = createAction('[USER] status');

export const loading = createAction('[USER] loading', props<{ loading }>());
export const setMessage = createAction('[USER] set message',props<{ message }>());


export const login  = createAction('[USER] login', props<{ email, password }>());
export const logout = createAction('[USER] logout');
export const loginSuccess = createAction('[USER] login success', props<{ user: User }>());

export const register = createAction('[USER] register', props<{ email, password, confirmedPassword }>());

export const cleanSettings = createAction('[USER] clean settings');
export const setSettings = createAction('[USER] set settings', props<{ settings: Settings }>());

export const getResetCode = createAction('[USER] create reset code',props<{email:string}>());
export const getResetCodeSuccess = createAction('[USER] create reset code success');

export const validateResetCode = createAction('[USER] validate reset code', props<{ code: string,email:string}>());
export const validateResetCodeSuccess = createAction('[USER] validate reset code success');

export const resetPassword = createAction('[USER] reset password', props<{ email, newPassword, confirmedPassword }>());
export const resetPasswordSuccess = createAction('[USER] reset password success');


export const clearState = createAction('[USER] clear state');

