import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../_services/index';
import {JwtHelper} from 'angular2-jwt/angular2-jwt';

@Injectable()
export class AdminGuard implements CanActivate {ç
    userRole: String;
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private router: Router) {
    }
    canActivate() {
        if(localStorage.getItem("currentUser")){
            this.userRole = this.jwtHelper.decodeToken(localStorage.getItem('currentUser'))._doc.role;
        }
        if(this.userRole === "ADMIN"){
            return true;
        }else{
            this.router.navigate(['/login']);
            return false;
        }
        
    }
}