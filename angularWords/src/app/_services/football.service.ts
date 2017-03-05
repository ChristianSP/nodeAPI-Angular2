import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { AuthenticationService } from './authentication.service';
import { UrlService } from './url.service';

 
@Injectable()
export class FootballService {
    private footballToken = "3f74a2556b244c24bb5b10fce8a2b029";

    private idPrimeraDivision = 436;

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService,
        private urlService: UrlService) {
    }
 
    getTeamsByCompetition(idCompetition): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'X-Auth-Token': this.footballToken });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.get(this.urlService.getTeamsByCompetition(idCompetition),options)
            .map((response: Response) => {
                if(response.json()){
                    return response.json();
                }
            });
    }

    getFixturesByCompetitionAndMatchDay(idCompetition,matchDay): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'X-Auth-Token': this.footballToken });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.get(this.urlService.getFixturesByCompetitionAndMatchDay(idCompetition,matchDay),options)
            .map((response: Response) => {
                if(response.json()){
                    return response.json();
                }
            });
    }

    getPlayersByTeamURL(teamURL): Observable<String[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'X-Auth-Token': this.footballToken });
        let options = new RequestOptions({ headers: headers });
        // get users from api
        return this.http.get(teamURL,options)
            .map((response: Response) => {
                if(response.json()){
                    return response.json();
                }
            });
    }

    getIdPrimeraDivision(){
        return this.idPrimeraDivision;
    }
}

