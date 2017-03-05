import { Component, OnInit } from '@angular/core';
import { LigasService } from '../_services/ligas.service';

@Component({
  selector: 'app-ligas',
  templateUrl: './ligas.component.html',
  styleUrls: ['./ligas.component.scss']
})
export class LigasComponent{

    msg = "";
    error = "";
    ligas: any;
    settings = {
        title: "ligas",
        columns: [{
            title: 'ligas.name.placeholder',
            key: 'name'
            },{
            title: 'ligas.idApi.placeholder',
            key: 'idApi'
            }
        ]
    };

    constructor(private ligasService: LigasService) {
        this.getLigas();
    }
    
    create(event){
        this.ligasService.create(event)
        .subscribe((response:any) => {
            this.msg = "";
            this.error = "";
            if(response.success){
                this.msg = 'row.created';
            }else{
                this.error = 'error.unknown';
            }
            this.getLigas();
        });
    }

    delete(event){
        this.ligasService.delete(event)
        .subscribe((response:any) => {
            this.msg = "";
            this.error = "";
            if(response.success){
                this.msg = 'row.deleted';
            }else{
                this.error = 'error.unknown';
            }
            this.getLigas();
        });
    }

    edit(event){
        this.ligasService.edit(event.oldRow,event.newRow)
        .subscribe((response:any) => {
            this.msg = "";
            this.error = "";
            if(response.success){
                this.msg = 'row.edited';
            }else{
                this.error = 'error.unknown';
            }
            this.getLigas();
        });
    }

    getLigas(){
        this.ligasService.getLigas()
        .subscribe(ligas => {
            if(ligas){
                this.ligas = ligas;
            }
        });
    }

}
