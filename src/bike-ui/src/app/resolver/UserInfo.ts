import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngrx/store";
import {UserState} from "../state/user/user.reducers";
import {userStatus} from "../state/user/user.actions";


@Injectable()
export class UserInfo implements Resolve<any> {

  constructor(private store$: Store<UserState>) {
  };

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    this.store$.dispatch(userStatus())
  }
}
