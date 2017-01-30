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
    loading = false;
    error = '';
    msg = '';
 
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private fb: FormBuilder) {
            this.form = fb.group({
            'username' : [null,Validators.required],
            'password': [null,Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(15)])]
          })
         }
 
    ngOnInit() {
        this.authenticationService.logout();
        var path = this.router.url.split('/')[1];
        if(path === "confirmEmail"){
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
}