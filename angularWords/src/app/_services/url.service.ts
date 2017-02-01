import { Injectable } from '@angular/core';
 
@Injectable()
export class UrlService {
    //private baseUrl = "http://wordsapi.herokuapp.com"
    private baseApiUrl = "http://localhost:3033"

    constructor() {
    }
 
    login() {
        return this.baseApiUrl+"/login";
    }
    
    signup(){
        return this.baseApiUrl+"/signup";
    }

    confirmEmail(){
        return this.baseApiUrl+"/confirmEmail";
    }
 
    getUsers(){
        return this.baseApiUrl+"/api/users";
    }
}