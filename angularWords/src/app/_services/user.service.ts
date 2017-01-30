import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
 
import { AuthenticationService } from './authentication.service';
import { User } from '../_models/index';
 
@Injectable()
export class UserService {
    //private usersUrl = "http://localhost:3033/api/users";
    private usersUrl = "http://wordsapi.herokuapp.com/api/users";
    

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }
 
    getUsers(): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.usersUrl,{token:this.authenticationService.token} ,options)
            .map((response: Response) => {
                if(response.json().success){
                    return response.json().users;
                }else{
                    if(response.json().error = "noauth"){
                        this.authenticationService.logout();
                    }
                    return false;
                }
            });
    }
}
