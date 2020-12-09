export type LoginScreen = 'login' | 'logged-in' | 'logout' | 'reset' | 'register' | 'registerd' | 'code' | 'password' | 'done';



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
