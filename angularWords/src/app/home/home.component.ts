import { Component, OnInit } from '@angular/core';
 
import { User } from '../_models/index';
import { UserService, AuthenticationService } from '../_services/index';
import {JwtHelper} from 'angular2-jwt/angular2-jwt';
@Component({
    templateUrl: './home.component.html'
})
 
export class HomeComponent implements OnInit {
    users: any;
    user: any;
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private userService: UserService,private authService : AuthenticationService) { 
    }
 
    ngOnInit() {
        // get users from secure api end point
        this.userService.getUsers()
            .subscribe(users => {
                if(users)this.users = users;
            });
        this.user = this.jwtHelper.decodeToken(localStorage.getItem('currentUser'))._doc;
    }
}