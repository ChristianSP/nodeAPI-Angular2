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

    recoverPassword(){
        return this.baseApiUrl+"/recoverPassword";
    }

    resetPassword(){
        return this.baseApiUrl+"/resetPassword";
    }
 
    getUsers(){
        return this.baseApiUrl+"/api/users";
    }

    createUser(){
        return this.baseApiUrl+"/api/users/create";
    }
    
    deleteUser(){
        return this.baseApiUrl+"/api/users/delete";
    }

    editUser(){
        return this.baseApiUrl+"/api/users/edit";
    }

    resetPasswordByAdmin(){
        return this.baseApiUrl+"/api/users/resetPassword";
    }
}