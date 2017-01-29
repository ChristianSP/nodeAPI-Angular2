import { Component, OnInit } from '@angular/core';
 
import { User } from '../_models/index';
import { UserService, AuthenticationService } from '../_services/index';
import {JwtHelper} from 'angular2-jwt/angular2-jwt';
@Component({
    templateUrl: './users.component.html'
})
 
export class UsersComponent implements OnInit {
    users: any;

    constructor(private userService: UserService) { 
    }
 
    ngOnInit() {
        // get users from secure api end point
        this.userService.getUsers()
            .subscribe(users => {
                if(users)this.users = users;
            });
    }
}