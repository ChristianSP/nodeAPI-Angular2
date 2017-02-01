import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatcher } from '../signup/password-matcher'
import { AuthenticationService } from '../_services/index';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.scss']
})
 
export class ResetPasswordComponent implements OnInit {
    form: FormGroup;
    
    loading = false;
    error = '';
    msg = '';
 
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private fb: FormBuilder) {
            this.form = fb.group({
                'password': [null,Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(15)])],
                'confirmPassword': [null,Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(15)])]
            },{validator: passwordMatcher});
         }
 
    ngOnInit() {
        this.authenticationService.logout();
    }
 
    resetPassword() {
        this.loading = true;
         this.route.params
            .switchMap((params: Params) => this.authenticationService.resetPassword(this.form.controls['password'].value, params['token']))
            .subscribe((result: any) => {
                this.msg = ""
                this.error = "";
                if (result.success === true) {
                    // login successful
                    this.msg = 'password.reset.success';
                } else {
                    // login failed
                    if(result.error === "invalid"){
                        this.error = 'password.reset.invalid';
                    }else{
                        if(result.error === "expired"){
                            this.error = 'password.reset.expired';
                        }else{
                            this.error = 'error.unknown';
                        }
                    }
                }
                this.loading = false;
            });
    }
}