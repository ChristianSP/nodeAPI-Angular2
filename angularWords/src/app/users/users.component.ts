import { Component } from '@angular/core';
import { UserService } from '../_services/index';
import { TableComponent } from '../table/index';

@Component({
    selector: 'admin-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
 
export class UsersComponent{
    msg = "";
    error = "";
    users: any;
    settings = {
        title: "users",
        columns: [{
            title: 'username.placeholder',
            key: 'name'
            },{
            title: 'email.placeholder',
            key: 'email'
            },{
            title: 'user.role',
            key: 'role'
            }, {
            title: 'user.email.confirmed',
            key: 'isVerified'
            }
        ],
        customActions:[
            {
                title: 'password.reset',
                key: 'passwordReset',
                icon: 'fa fa-refresh'
            }
        ]
    };

    constructor(private userService: UserService) {
        this.getUsers();
    }
    
    createUser(event){
        this.userService.createUser(event)
        .subscribe((response:any) => {
            this.msg = "";
            this.error = "";
            if(response.success){
                this.msg = 'user.created';
            }else{
                if(response.error === "name"){
                    this.error = 'username.exists';
                }else{
                    if(response.error === "email"){
                        this.error = 'email.exists';
                    }else{
                        this.error = 'error.unknown';
                    }
                }
            }
            this.getUsers();
        });
    }

    deleteUser(event){
        this.userService.deleteUser(event)
        .subscribe((response:any) => {
            this.msg = "";
            this.error = "";
            if(response.success){
                this.msg = 'user.deleted';
            }else{
                this.error = 'error.unknown';
            }
            this.getUsers();
        });
    }

    editUser(event){
        this.userService.editUser(event.oldRow,event.newRow)
        .subscribe((response:any) => {
            this.msg = "";
            this.error = "";
            if(response.success){
                this.msg = 'user.edited';
            }else{
                this.error = 'error.unknown';
            }
            this.getUsers();
        });
    }

    getUsers(){
        this.userService.getUsers()
        .subscribe(users => {
            if(users){
                this.users = users;
            }
        });
    }

    resetPassword(user){
        this.userService.resetPassword(user)
        .subscribe((response:any) => {
            this.msg = "";
            this.error = "";
            if(response.success){
                this.msg = 'password.recover.success';
            }else{
                this.error = 'error.unknown';
            }
            this.getUsers();
        });
    }

    actionMapper(event){
        if(event.actionKey === "passwordReset"){
            this.resetPassword(event.row);
        }
    }
}