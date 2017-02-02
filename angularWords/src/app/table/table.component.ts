import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
    selector: 'table-smart',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
 
export class TableComponent implements OnInit {
    @Input('source')
    data: Array<any>;
    filteredData: Array<any>;
    filterInputs: FormGroup;

    @Input()
    settings = {
        title: "Title1",
        columns: [{
            title: 'Name',
            key: 'name'
            },{
            title: 'Email',
            key: 'email'
            },{
            title: 'Role',
            key: 'role'
            },{
            title: 'Email confirmed',
            key: 'isVerified'
            }
        ]
    };

    constructor() {
        var columns = {}
        for(let column of this.settings.columns){
            columns[column.key] = new FormControl("");
        }
        this.filterInputs = new FormGroup(columns);
    }
 
    ngOnInit() {
        this.filteredData = this.data;
    }

    filter(event: any){
        this.filteredData = [];
        for(let element of this.data){
            var flag: Boolean = true;
            for(let column of this.settings.columns){
                var target: String = element[column.key].toString();
                if(!target.toLowerCase().includes(this.filterInputs.get(column.key).value.toLowerCase())){
                    flag=false;
                }
            }
            if(flag){
                this.filteredData.push(element);
            }
        }
    }
}