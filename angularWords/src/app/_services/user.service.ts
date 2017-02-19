import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { AuthenticationService } from './authentication.service';
import { UrlService } from './url.service';

 
@Injectable()
export class UserService {
    
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService,
        private urlService: UrlService) {
    }
 
    getUsers(): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.get(this.urlService.getUsers(),options)
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

    getCurrentUser(): Observable<String>{
        return this.getUsers().map((users:any) => {
            var currentUser = this.authenticationService.getCurrentUser();
            if(users){
                for(let user of users){
                    if(user.name === currentUser.name){
                        return user;
                    }
                }
            }
        });
    }

    createUser(user: any): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.createUser(),{user:user} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    deleteUser(user: any): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.deleteUser(),{user:user} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    editUser(oldUser: any,newUser: any): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.editUser(),{oldUser: oldUser,newUser: newUser} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    resetPassword(user:any): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.resetPasswordByAdmin(),{user: user} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    addFriend(newFriend: any): Observable<String[]>{
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        var user = this.authenticationService.getCurrentUser();
        return this.http.post(this.urlService.addFriend(),{user: user, newFriend: newFriend} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    acceptFriend(friend: any): Observable<String[]>{
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        var user = this.authenticationService.getCurrentUser();
        return this.http.post(this.urlService.acceptFriend(),{user: user, friend: friend} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    cancelFriend(friend: any): Observable<String[]>{
    // add authorization header with jwt token
    let headers = new Headers({ 'x-access-token': this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });
    // get users from api
    var user = this.authenticationService.getCurrentUser();
    return this.http.post(this.urlService.cancelFriend(),{user: user, friend: friend} ,options)
        .map((response: Response) => {
            return response.json();
        });
    }
}

