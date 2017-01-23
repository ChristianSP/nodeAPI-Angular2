import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {APP_BASE_HREF} from '@angular/common';

import { EqualValidator } from './equal-validator.directive'
// used to create fake backend
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
 
import { AppComponent }  from './app.component';
import { routing }        from './app.routing';
 
import { AuthGuard } from './_guards/index';
import { AuthenticationService, UserService } from './_services/index';
import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';
import { MenuComponent } from './menu/menu.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        routing
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        MenuComponent,
        SignupComponent,
        EqualValidator
    ],
    providers: [
        AuthGuard,
        AuthenticationService,
        UserService,
 
        // providers used to create fake backend
        MockBackend,
        BaseRequestOptions,
        {provide: APP_BASE_HREF, useValue: "/"}
    ],
    bootstrap: [AppComponent]
})
 
export class AppModule { }