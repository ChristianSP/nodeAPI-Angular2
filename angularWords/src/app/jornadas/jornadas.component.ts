import { Component, OnInit } from '@angular/core';
import { JornadasService } from '../_services/jornadas.service';

@Component({
  selector: 'app-jornadas',
  templateUrl: './jornadas.component.html',
  styleUrls: ['./jornadas.component.scss']
})
export class JornadasComponent{

  msg = "";
    error = "";
    jornadas: any;
    settings = {
        title: "jornadas",
        columns: [{
            title: 'jornadas.liga.placeholder',
            key: 'liga'
            },{
            title: 'jornadas.inicio.placeholder',
            key: 'inicio'
            },{
            title: 'jornadas.fin.placeholder',
            key: 'fin'
            },{
            title: 'jornadas.matchday.placeholder',
            key: 'matchday'
            }
        ],
        edit: false
    };

    constructor(private jornadasService: JornadasService) {
        this.getJornadas();
    }
    
    create(event){
        this.jornadasService.create(event)
        .subscribe((response:any) => {
            this.msg = "";
            this.error = "";
            if(response.success){
                this.msg = 'row.created';
            }else{
                this.error = 'error.unknown';
            }
            this.getJornadas();
        });
    }

    delete(event){
        this.jornadasService.delete(event)
        .subscribe((response:any) => {
            this.msg = "";
            this.error = "";
            if(response.success){
                this.msg = 'row.deleted';
            }else{
                this.error = 'error.unknown';
            }
            this.getJornadas();
        });
    }

    edit(event){
        this.jornadasService.edit(event.oldRow,event.newRow)
        .subscribe((response:any) => {
            this.msg = "";
            this.error = "";
            if(response.success){
                this.msg = 'row.edited';
            }else{
                this.error = 'error.unknown';
            }
            this.getJornadas();
        });
    }

    getJornadas(){
        this.jornadasService.getJornadas()
        .subscribe(jornadas => {
            if(jornadas){
                this.jornadas = jornadas;
            }
        });
    }

}
