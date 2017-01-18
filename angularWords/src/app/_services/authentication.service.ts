import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {
    public token: string;
    private loginUrl = "http://localhost:3033/api/login";
    private signupUrl = "http://localhost:3033/api/signup";
    

    public test: any;
    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.test = {};
    }
 
    login(username: string, password: string): Observable<boolean> {
        this.test = JSON.stringify({ username: username, password: password });
        let headers = new Headers();

        //headers.append('Accept', 'application/json');
        return this.http.post(this.loginUrl, JSON.stringify({ username: username, password: password }),{headers: headers})
            .map((response: Response) => {
                this.test = response;

                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = token;
 
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
 
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }
    
    signup(username: string,email: string, password: string): Observable<boolean> {
        this.test = JSON.stringify({ username: username, password: password });
        let headers = new Headers();

        //headers.append('Accept', 'application/json');
        console.log(JSON.stringify({ name: username,email: email, password: password }));
        return this.http.post(this.signupUrl, { name: username,email: email, password: password },{headers: headers})
            .map((response: Response) => {
                this.test = response;

                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().success;
                if (token) {
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }
 
    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}