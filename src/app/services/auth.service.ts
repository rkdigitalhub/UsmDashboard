import { Injectable } from '@angular/core';

@Injectable({
providedIn:'root'
})

export class AuthService{

isLoggedIn(){

return localStorage.getItem('loggedIn')==='true';

}

logout(){

localStorage.removeItem('loggedIn');

}

}