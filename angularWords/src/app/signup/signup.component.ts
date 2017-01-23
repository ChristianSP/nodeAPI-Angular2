import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatcher } from './password-matcher'
import { AuthenticationService } from '../_services/index';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    loading = false;
    error = '';
    msg = "";
    form: FormGroup;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private fb: FormBuilder) {
          this.form = fb.group({
            'username' : [null,Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(15)])],
            'email': [null,Validators.compose([Validators.required,Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/)])],
            'password': [null,Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(15)])],
            'confirmPassword': [null,Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(15)])]
          },{validator: passwordMatcher})
         }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }
    signup() {
        this.loading = true;
        this.authenticationService.signup(this.form.controls['username'].value,this.form.controls['email'].value,this.form.controls['password'].value)
            .subscribe((result: any) => {
                if (result.success === true) {
                    this.msg = "User saved successful";
                } else {
                    if(result.error === "name"){
                        this.error = 'Username already in use';
                    }else{
                        if(result.error === "email"){
                            this.error = 'Email already in use';
                        }
                    }
                    this.loading = false;
                }
            });
    }
}