import { Component } from '@angular/core';
import { UserService } from '../_services/index';
import { TableComponent } from '../table/index';

@Component({
    selector: 'admin-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
 
export class UsersComponent{
    users: any;
    settings = {
        title: "users",
        columns: [{
            title: 'Name',
            key: 'name'
            },{
            title: 'Email',
            key: 'email'
            },{
            title: 'Role',
            key: 'role'
            }, {
            title: 'Email confirmed',
            key: 'isVerified'
            }
        ]
    };

    constructor(private userService: UserService) {
        this.userService.getUsers()
        .subscribe(users => {
            if(users){
                this.users = users;
            }
        });
    }
}