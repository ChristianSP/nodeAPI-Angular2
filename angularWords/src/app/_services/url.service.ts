import { Injectable } from '@angular/core';
 
@Injectable()
export class UrlService {
    //private baseApiUrl = "http://wordsapi.herokuapp.com"
    private baseApiUrl = "http://localhost:3033"

    private footballApiUrl = "http://api.football-data.org/v1"

    constructor() {
    }
    
    api(){
        return this.baseApiUrl;
    }

    login() {
        return this.baseApiUrl+"/login";
    }
    
    signup(){
        return this.baseApiUrl+"/signup";
    }

    confirmEmail(){
        return this.baseApiUrl+"/confirmEmail";
    }

    recoverPassword(){
        return this.baseApiUrl+"/recoverPassword";
    }

    resetPassword(){
        return this.baseApiUrl+"/resetPassword";
    }
 
    getUsers(){
        return this.baseApiUrl+"/api/users";
    }

    createUser(){
        return this.baseApiUrl+"/api/users/create";
    }
    
    deleteUser(){
        return this.baseApiUrl+"/api/users/delete";
    }

    editUser(){
        return this.baseApiUrl+"/api/users/edit";
    }

    resetPasswordByAdmin(){
        return this.baseApiUrl+"/api/users/resetPassword";
    }

    addFriend(){
        return this.baseApiUrl+"/api/users/addFriend";
    }

    acceptFriend(){
        return this.baseApiUrl+"/api/users/acceptFriend";
    }

    cancelFriend(){
        return this.baseApiUrl+"/api/users/cancelFriend";
    }

    getCompetition(id){
        return this.footballApiUrl+"/competitions/"+id;
    }

    getTeamsByCompetition(idCompetition){
        return this.footballApiUrl+"/competitions/"+idCompetition+"/teams";
    }

    getFixturesByCompetitionAndMatchDay(idCompetition,matchDay){
        return this.footballApiUrl+"/competitions/"+idCompetition+"/fixtures?matchday="+matchDay;
    }

    getLigas(){
        return this.baseApiUrl+"/api/ligas";
    }

    createLiga(){
        return this.baseApiUrl+"/api/ligas/create";
    }
    
    deleteLiga(){
        return this.baseApiUrl+"/api/ligas/delete";
    }

    editLiga(){
        return this.baseApiUrl+"/api/ligas/edit";
    }

    getJornadas(){
        return this.baseApiUrl+"/api/jornadas";
    }

    createJornada(){
        return this.baseApiUrl+"/api/jornadas/create";
    }
    
    deleteJornada(){
        return this.baseApiUrl+"/api/jornadas/delete";
    }

    editJornada(){
        return this.baseApiUrl+"/api/jornadas/edit";
    }

    getCurrentJornadaByLiga(){
        return this.baseApiUrl+"/api/jornadas/currentByLiga";
    }
}