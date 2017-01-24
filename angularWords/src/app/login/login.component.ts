import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/index';
 
@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
 
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    error = '';
 
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private fb: FormBuilder) {
            this.form = fb.group({
            'username' : [null,Validators.required],
            'password': [null,Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(15)])]
          })
         }
 
    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }
 
    login() {
        this.loading = true;
        this.authenticationService.login(this.form.controls['username'].value, this.form.controls['password'].value)
            .subscribe((result: any) => {
                if (result.success === true) {
                    // login successful
                    this.router.navigate(['/']);
                } else {
                    // login failed
                    if(result.error === "name"){
                        this.error = 'email.incorrect';
                    }else{
                        if(result.error === "password"){
                            this.error = 'password.invalid';
                        }
                    }
                }
                this.loading = false;
            });
    }
}