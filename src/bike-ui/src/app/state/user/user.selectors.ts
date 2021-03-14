import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducers';

export const selectUserState = createFeatureSelector<UserState>('user');

export const getScreen = createSelector(selectUserState, ({screen}) => screen);
export const getLoading = createSelector(selectUserState, ({loading}) => loading);

export const getMessage = createSelector(selectUserState, ({message}) =>message);
export const getUser = createSelector(selectUserState, (state: UserState) => state.user);
