import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/index';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
 
export class LoginComponent implements OnInit {
    form: FormGroup;
    formRecover: FormGroup;
    
    loading = false;
    forgotShowing = false;
    error = '';
    msg = '';
    recoverMsg = '';
 
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private fb: FormBuilder) {
            this.form = fb.group({
                'username' : [null,Validators.required],
                'password': [null,Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(15)])]
            });
            this.formRecover = fb.group({
                'email': [null,Validators.compose([Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])]
            });
         }
 
    ngOnInit() {
        this.authenticationService.logout();
        var path = this.router.url.split('/')[1];
        if(path === "confirmEmail"){
            this.confirmMail();
        }
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
                        }else{
                            if(result.error === "noverified"){
                                this.error = 'login.noverified';
                            }
                        }
                    }
                }
                this.loading = false;
            });
    }

    confirmMail(){
        this.route.params
            .switchMap((params: Params) => this.authenticationService.confirmEmail(params['token']))
            .subscribe((result: any) => {
                if(result.success === true){
                    this.msg = 'login.verified';
                }else{
                    if(result.error === "alreadyVerified"){
                        this.error = 'login.verified.already';
                    }else{
                        this.error = 'error.unknown';
                    }
                }
            });
    }

    recoverPassword(){
        this.loading = true;
        this.authenticationService.recoverPassword(this.formRecover.controls['email'].value)
            .subscribe((result: any) => {
                this.recoverMsg = 'password.recover.success';
                this.loading = false;
            });
    }

    showForgot(){
        this.forgotShowing = !this.forgotShowing;
    }
}