import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { AuthenticationService } from './authentication.service';
import { UrlService } from './url.service';

 
@Injectable()
export class JornadasService {
    
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService,
        private urlService: UrlService) {
    }
 
    getJornadas(): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.get(this.urlService.getJornadas(),options)
            .map((response: Response) => {
                if(response.json().success){
                    return response.json().jornadas;
                }else{
                    if(response.json().error = "noauth"){
                        this.authenticationService.logout();
                    }
                    return false;
                }
            });
    }

    create(jornada: any): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.createJornada(),{jornada:jornada} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    delete(jornada: any): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.deleteJornada(),{jornada:jornada} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    edit(oldJornada: any,newJornada: any): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.editJornada(),{oldJornada: oldJornada,newJornada: newJornada} ,options)
            .map((response: Response) => {
                return response.json();
            });
    }

    getCurrentJornadaByLiga(liga): Observable<String[]>{
        // add authorization header with jwt token
        let headers = new Headers({ 'x-access-token': this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.post(this.urlService.getCurrentJornadaByLiga(),{liga: liga} ,options)
            .map((response: Response) => {
                if(response.json().success){
                    return response.json().jornada;
                }else{
                    return false;
                }
            });
    }
}

