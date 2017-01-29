import { Routes, RouterModule } from '@angular/router';
 
import { LoginComponent } from './login/index';
import { SignupComponent } from './signup/index';
import { HomeComponent } from './home';
import { AuthGuard } from './_guards/index';
 
const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'confirmEmail/:token', component: LoginComponent},
    
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
 
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
 export const routing = RouterModule.forRoot(appRoutes);