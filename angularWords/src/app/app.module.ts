import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {APP_BASE_HREF} from '@angular/common';

// used to create fake backend
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
 
import { AppComponent }  from './app.component';
import { routing }        from './app.routing';
 
import { AuthGuard, AdminGuard } from './_guards/index';
import { AuthenticationService, UserService, UrlService, SocialService } from './_services/index';
import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';
import { UsersComponent } from './users/index';
import { TableComponent } from './table/index';
import { ResetPasswordComponent } from './resetpassword/index';
import { SocialComponent } from './social/index';
import { SignupComponent } from './signup/signup.component';
import { TranslationClass} from './translate/translation';
import { TranslatePipe} from './translate/translation.pipe';
import { TranslateService} from './translate/translation.service';


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
        SignupComponent,
        UsersComponent,
        ResetPasswordComponent,
        SocialComponent,
        TableComponent,
        TranslatePipe
    ],
    providers: [
        AuthGuard,
        AdminGuard,
        AuthenticationService,
        UserService,
        UrlService,
        SocialService,
        {provide: TranslationClass.TRANSLATIONS, useValue: TranslationClass.dictionary},
        TranslateService,
        // providers used to create fake backend
        MockBackend,
        BaseRequestOptions,
        {provide: APP_BASE_HREF, useValue: "/"}
    ],
    bootstrap: [AppComponent]
})
 
export class AppModule { }