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
    model: any = {};
    loading = false;
    error = '';
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
        this.authenticationService.signup(this.model.username,this.model.email,this.model.password)
            .subscribe(result => {
                if (result === true) {
                    // login successful
                    this.router.navigate(['/']);
                } else {
                    // login failed
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }
}