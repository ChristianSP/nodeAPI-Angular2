import { Component, OnInit } from '@angular/core';
 
import { User } from '../_models/index';
import { UserService, AuthenticationService } from '../_services/index';
import {JwtHelper} from 'angular2-jwt/angular2-jwt';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@Component({
    templateUrl: './users.component.html'
})
 
export class UsersComponent implements OnInit {
    users: any;
    filteredUsers: Array<any>;
    settings = {
        columns: {
            name: {
            title: 'Name'
            },
            email: {
            title: 'Email'
            },
            role: {
            title: 'Role'
            },
            isVerified: {
            title: 'Email confirmed'
            }
        }
    };

    constructor(private userService: UserService) { 
    }
 
    ngOnInit() {
        // get users from secure api end point
        this.userService.getUsers()
            .subscribe(users => {
                if(users){
                    this.users = users;
                    this.filteredUsers = users;
                }
            });
    }

    filter(event: any){
        this.filteredUsers = [];
        for(let user of this.users){
            var target: String = user[event.target.id].toString();
            if(target.includes(event.target.value)){
                this.filteredUsers.push(user);
            }
        }
    }
}