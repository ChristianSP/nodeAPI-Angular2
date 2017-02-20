import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../_services/user.service';
import { FormControl } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { SocialService } from '../_services/social.service';


@Component({
    selector: "social-component",
    templateUrl: './social.component.html',
    styleUrls: ['./social.component.scss']
})

export class SocialComponent implements OnInit, OnDestroy{
    currentTab : String;
    users : any;
    filteredUsers : any;
    searchInput : FormControl;
    currentUser : any;
    pendingFriends : any;
    connectedFriends : any;
    disconnectedFriends : any;
    connection : any;

    pendingCollapsed : Boolean = true;
    connectedCollapsed : Boolean = true;
    disconnectedCollapsed : Boolean = true;

    constructor(private userService : UserService,
                private authService : AuthenticationService,
                private socialService : SocialService){
        this.currentTab = "friends";
        this.getUsers();
        this.prepareFriends();
        this.searchInput = new FormControl();
    }

    ngOnInit(){
        this.connection = this.socialService.friendConnected().subscribe(message => {
            if(message){
                this.userService.getUsers()
                .subscribe(users => {
                    if(users){
                        this.users = users;
                        this.prepareFriends();
                    }
                });
            }
        });
    }

    ngOnDestroy(){
        this.connection.unsubscribe();
    }

    searchUsers(){
        this.userService.getCurrentUser()
        .subscribe((currentUser:any) =>{
            this.filteredUsers = [];
            var target: String = this.searchInput.value.toLowerCase();
            if(target != ""){
                for(let user of this.users){
                    var flag = true;
                    for(let friend of user.friends){
                        if(friend.user == currentUser.name){
                            flag = false;
                        }
                    }
                    if(flag){
                        var username = user.name.toLowerCase();
                        if(username.includes(target) && username != currentUser.name){
                            this.filteredUsers.push(user);
                        }
                    }
                }
            }
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

    getCurrentUser(){
        this.userService.getCurrentUser()
        .subscribe(user => {
            if(user){
                this.currentUser = user;
            }
        });
    }

    addFriend(user: any){
        this.userService.addFriend(user)
        .subscribe((res:any) => {
            if(res.success){
                this.getUsers();
                this.searchUsers();
                this.prepareFriends();
                this.socialService.requestSended(this.currentUser.name,user.name);
            }
        });
    }

    prepareFriends(){
        this.userService.getCurrentUser()
        .subscribe(user => {
            if(user){
                this.currentUser = user;
                this.pendingFriends = [];
                this.connectedFriends = [];
                this.disconnectedFriends = [];
                for(let friend of this.currentUser.friends){
                    if(friend.status === "PENDING"){
                        this.pendingFriends.push(friend);
                    }
                    if(friend.status === "ACCEPTED"){
                        var found = false;
                        for(var i = 0 ; i < this.users.length && !found ; i++){
                            if(this.users[i].name === friend.user){
                                if(this.users[i].status === "CONNECTED"){
                                    this.connectedFriends.push(friend);
                                }else{
                                    this.disconnectedFriends.push(friend);
                                }
                                found = true;
                            }
                        }
                    }
                    if(friend.status === "SENDED"){
                        this.disconnectedFriends.push(friend);
                    }
                }
            }
        });
    }

    acceptFriend(friend){
        this.userService.acceptFriend(friend)
        .subscribe((res:any) => {
            if(res.success){
                this.prepareFriends();
                this.socialService.requestAccepted(this.currentUser.name,friend.user);
            }
        });
    }

    cancelFriend(friend){
        this.userService.cancelFriend(friend)
        .subscribe((res:any) => {
            if(res.success){
                this.getUsers();
                this.searchUsers();
                this.prepareFriends();
            }
        });
    }
}