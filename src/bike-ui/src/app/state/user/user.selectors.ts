import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducers';

export const selectUserState = createFeatureSelector<UserState>('user');

export const getScreen = createSelector(selectUserState, (state: UserState) => state.screen);

export const getUser = createSelector(selectUserState, (state: UserState) => state.user);
