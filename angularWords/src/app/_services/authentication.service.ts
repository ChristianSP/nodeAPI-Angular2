import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import {JwtHelper} from 'angular2-jwt/angular2-jwt';
import { UrlService } from './url.service'; 


@Injectable()
export class AuthenticationService {
    public token: string;
    public currentUser: any;
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private http: Http,private router: Router,private urlService : UrlService) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        if(localStorage.getItem('currentUser')){
            this.currentUser = this.jwtHelper.decodeToken(localStorage.getItem('currentUser'))._doc;
        }
    }

    confirmEmail(token: string): Observable<boolean>{
        return this.http.post(this.urlService.confirmEmail(),{token: token})
                .map((response:Response) => {
                    return response.json();
                })
    }
 
    login(username: string, password: string): Observable<boolean> {
        let headers = new Headers();
        
        return this.http.post(this.urlService.login(), { name: username, password: password },{headers: headers})
            .map((response: Response) => {

                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = token;
 
                    // store username and jwt token in local storage to keep user logged in between page refreshe
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
                    this.currentUser = this.jwtHelper.decodeToken(localStorage.getItem('currentUser'))._doc;
 
                }
                return response.json();
            });
    }
    
    signup(username: string,email: string, password: string): Observable<boolean> {
        let headers = new Headers();

        return this.http.post(this.urlService.signup(), { name: username,email: email, password: password },{headers: headers})
            .map((response: Response) => {
                return response.json();
            });
    }
 
    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        var path = this.router.url.split('/')[1];
        if(path != "signup" && path != "confirmEmail"){
            this.router.navigate(['/login']);
        }
    }

    isLogged(): Boolean{
        if(localStorage.getItem('currentUser')){
            return true;
        }else{
            return false;
        }
  }

  isRole(role:String): Boolean{
        if(!this.isLogged()){
            return false;
        }else{
            if(this.currentUser.role === role){
                return true;
            }else{
                return false;
            }
        }
  }

  getCurrentUser(): any{
      if(!this.isLogged()){
          return null;
      }else{
          return this.jwtHelper.decodeToken(localStorage.getItem('currentUser'))._doc;
      }
  }
}