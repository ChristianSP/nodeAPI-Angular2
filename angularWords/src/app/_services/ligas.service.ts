import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { AuthenticationService } from './authentication.service';
import { UrlService } from './url.service';

 
@Injectable()
export class LigasService {
    
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService,
        private urlService: UrlService) {
    }
 
    getLigas(): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.get(this.urlService.getLigas(),options)
            .map((response: Response) => {
                if(response.json().success){
                    return response.json().ligas;
                }else{
                    if(response.json().error = "noauth"){
                        this.authenticationService.logout();
                    }
                    return false;
                }
            });
    }

    create(liga: any): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.createLiga(),{liga:liga} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    delete(liga: any): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.deleteLiga(),{liga:liga} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    edit(oldLiga: any,newLiga: any): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.editLiga(),{oldLiga: oldLiga,newLiga: newLiga} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }
}

