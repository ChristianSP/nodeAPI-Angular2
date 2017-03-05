import { Component, OnInit } from '@angular/core';
 
import { User } from '../_models/index';
import { UserService, AuthenticationService,FootballService,LigasService, JornadasService } from '../_services/index';
import {JwtHelper} from 'angular2-jwt/angular2-jwt';
import { SocialComponent } from '../social/index';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
 
export class HomeComponent implements OnInit {
    

    users: any;
    user: any;
    jwtHelper: JwtHelper = new JwtHelper();

    teams: any;
    jornada: any;

    ligas: any;
    selectedLiga: any;
    constructor(private userService: UserService
                ,private authService : AuthenticationService
                ,private footballService: FootballService
                ,private ligasService: LigasService
                ,private jornadaService: JornadasService) { 
    }
 
    ngOnInit() {
        // get users from secure api end point
        this.userService.getUsers()
            .subscribe(users => {
                if(users)this.users = users;
            });    
        this.user = this.jwtHelper.decodeToken(localStorage.getItem('currentUser'))._doc;

        this.ligasService.getLigas().subscribe(ligas => {
            if(ligas){
                this.ligas = ligas;
            }
        });
    }

    getTeamCrestByName(nameTeam){
        if(this.teams && this.teams.length > 0){
            return this.teams.filter(function(el){ return el.name == nameTeam })[0].crestUrl;
        }else{
            return "";
        }
    }

    updateLigaInfo(liga){
        if(liga){
            this.selectedLiga=liga;
            this.jornada=[];
            this.teams=[];
            this.footballService.getTeamsByCompetition(liga.idApi)
                .subscribe((res:any) => {
                    if(res.teams){
                        this.teams = res.teams;
                    }
                });
            this.jornadaService.getCurrentJornadaByLiga(liga).subscribe((jornada:any) => {
                if(jornada){
                    this.footballService.getFixturesByCompetitionAndMatchDay(liga.idApi,jornada.matchday)
                    .subscribe((res:any) => {
                        if(res.fixtures){
                            this.jornada = res.fixtures;
                        }
                    });
                }
            });
        }
    }

    loadTeamPlayers(team){
        if(!team.players){
            this.footballService.getPlayersByTeamURL(team._links.players.href)
                .subscribe((res:any) => {
                    if(res.players){
                        team.players = res.players
                    }
                });
        }
    }
}