import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
 
import { AuthenticationService } from './authentication.service';
import { User } from '../_models/index';
 
@Injectable()
export class UserService {
    private usersUrl = "http://localhost:8080/oportunidades-web/test/getUsuarios.action";

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }
 
    getUsers(): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        console.log(options);
        // get users from api
        return this.http.get(this.usersUrl, options)
            .map((response: Response) => response.json() as String[]);
    }
}

