export type LoginScreen = 'login' | 'logged-in' | 'logout' | 'reset' | 'register' | 'registered' | 'code' | 'password' | 'done';



export interface User {
    name: string;
    roles: string[];
}


export interface Settings {
    name:string;
    age:number;
    class:string;
    active:boolean;
    image:string; // link
}



export class State {

    login     = {index: -1}
    register  = {index: -1}
    registered = {index: -1}

    reset     = {index: -1}
    code      = {index: -1}
    password  = {index: -1}
    done      = {index: -1}

    logout    = {index: -1}

    onLogin() {
        this.login.index    =  0;
        this.logout.index   = -1;
        this.register.index = -1;
        this.reset.index    = -1;
        this.code.index     = -1;
        this.password.index = -1;
    };
    onLongedIn() {
        this.login.index    = -1;
        this.logout.index   = -1;
        this.register.index = -1;
        this.reset.index    = -1;
        this.code.index     = -1;
        this.password.index = -1;
    };
    onLogout() {
        this.login.index    = -1;
        this.logout.index   = -1;
        this.register.index = -1;
        this.reset.index    = -1;
        this.code.index     = -1;
        this.password.index = -1;
    };

    onRegister() {
        this.login.index    =  0;
        this.logout.index   = -1;
        this.register.index =  0;
        this.reset.index    = -1;
        this.code.index     = -1;
        this.password.index = -1;
    };

    onReset() {
        this.login.index    = -1;
        this.logout.index   = -1;
        this.register.index = -1;
        this.reset.index    =  0;
        this.code.index     = -1;
        this.password.index = -1;
    };

    onCode() {
        this.login.index    = -1;
        this.logout.index   = -1;
        this.register.index = -1;
        this.reset.index    =  0;
        this.code.index     =  0;
        this.password.index = -1;
    };

    onPassword() {
        this.login.index    = -1;
        this.logout.index   = -1;
        this.register.index = -1;
        this.reset.index    = -1;
        this.code.index     = -1;
        this.password.index =  0;
    };
    onDone() {
        this.login.index    = -1;
        this.logout.index   = -1;
        this.register.index = -1;
        this.reset.index    = -1;
        this.code.index     = -1;
        this.password.index = -1;
    };

}
