import { Component, OnInit,Input,Output,EventEmitter,OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
    selector: 'table-smart',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
 
export class TableComponent implements OnInit,OnChanges {
    /*Lista de datos que se muestran*/
    showedData: Array<any>
    
    /*Contenedor de los input asignados al filtro.
    Nos permite acceder a su valor*/
    filterInputs: FormGroup;

    /*Contenedor de los input asignados a la creacion de una fila.
    Nos permite acceder a su valor*/
    createInputs: FormGroup;

    /*Contenedor de los input asignados a la edicion de una fila.
    Nos permite acceder a su valor*/
    editInputs: FormGroup;

    /* Bandera que indica si se esta añadiendo una nueva fila o no */
    adding: Boolean = false;

    /* Bandera que indica si se esta editando una fila o no */
    editing: Boolean = false;

    /* Bandera que indica si se esta borrando una fila o no */
    deleting: Boolean = false;

    /* Numeor que indica la fila que se esta editando */
    currentEdit: number;

    /* Numeor que indica la fila que se esta borrando */
    currentDelete: number;

    /*Numero de paginas que tiene la tabla*/
    nPages: number;
    /*Lista con los numeros de cada pagina para mostrarlos*/
    pages: Array<any>;
    /*Numero de la pagina actual >= 1 y <= nPages*/
    currentPage: number;
    
    /*Numero que indica si la tabla esta ordenada por alguna columna
        0: No se esta ordenando
        1: Se esta ordenando ASC
        -1: Se esta ordenando DESC
        */
    sorting: number = 0;
    /* Clave de la columna por la que se esta ordenando */
    currentSort;

    /*Datos de entrada*/
    @Input('source')
    data: Array<any> = [
        {col1: "row1 col1",col2: "row1 col2"},
        {col1: "row2 col1",col2: "row2 col2"},
    ];
    
    /*Configuracion de entrada
        title: Titulo de la tabla
        columns: Lista con la configuracion de cada columna
        paginacion: Numero de filas por pagina
        */
    @Input()
    settings = {
        title: "Title",
        columns: [{
            title: 'Col1Title',
            key: 'col1'
            },{
            title: 'Col2Title',
            key: 'col2'
            }
        ],
        pagination: 5,
        filtering: true,
        actions: true,
        add: true,
        remove: true,
        edit: true,
        customActions:[{
            key: "customAction1",
            title: "Custom action 1",
            icon: "fa fa-random"
        }]

    };

    @Output()
    created: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    deleted: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    edited: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    actionEmitter: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    ngOnChanges(){
        /*Crear formulario con los input del filtro
        y de la creacion de nuevo registro */
        var columnsFilter = {};
        var columnsCreate = {};
        var columnsEdit = {};
        for(let column of this.settings.columns){
            columnsFilter[column.key] = new FormControl("");
            columnsCreate[column.key] = new FormControl("");
            columnsEdit[column.key] = new FormControl("");
        }
        this.filterInputs = new FormGroup(columnsFilter);
        this.createInputs = new FormGroup(columnsCreate);
        this.editInputs = new FormGroup(columnsEdit);
        
        this.validateDefaults();

        //Inicializar los datos que se pintan
        this.filter();
        this.changePage(1);
    }
 
    ngOnInit() {

        
    }

    validateDefaults(){
        //Validar que la paginacion no sea 0, null o no este en settings
        if(this.settings.pagination === 0 || this.settings.pagination === undefined || this.settings.pagination === null){
            this.settings.pagination = 5;
        }

        //Validar que el filtro no sea null o no este en settings
        if(this.settings.filtering === undefined || this.settings.filtering === null){
            this.settings.filtering = true;
        }

        //Validar que la accion add no sea null o no este en settings
        if(this.settings.add === undefined || this.settings.add === null){
            this.settings.add = true;
        }

        //Validar que la accion remove no sea null o no este en settings
        if(this.settings.remove === undefined || this.settings.remove === null){
            this.settings.remove = true;
        }

        //Validar que la accion edit no sea null o no este en settings
        if(this.settings.edit === undefined || this.settings.edit === null){
            this.settings.edit = true;
        }

        //Validar que acciones no sea null o no este en settings
        if(this.settings.actions === undefined || this.settings.actions === null){
            this.settings.actions = true;
        }

        //Validar el valor de la acciones si viene a falso
        if(this.settings.actions === false){
            this.settings.add = false;
            this.settings.remove = false;
            this.settings.edit = false;    
        }

        //Validar el valor de acciones si todas vienen a falso
        if(this.settings.add === false && this.settings.remove === false && this.settings.edit === false){
            this.settings.actions = false;   
        }

        //Valida que los datos de entrada no sean undefined o null y ponerlos a vacio
        if(this.data === undefined || this.data === null){
            this.data = [];
        }

    }

    /*Metodo que cambia de pagina
    controlando la ordenacion y los filtros aplicados llamando a filtrar*/
    changePage(page: number){
        
        //Validar que la pagina no sea menor que la primera ni mayor que la ultima
        if(page != 0 && page <= this.nPages){
            
            //Actualizamos el valor de la pagina actual poniendo el de la nueva
            this.currentPage = page;

            /*Recuperamos toda la lista de datos a mostrar.
            vaciamos los datos que se estaban mostrando.
            se rellena la lista de datos que se muestran
            con la parte,de la lista de datos a mostrar, que le corresponde a esta pagina*/
            var allDataFiltered = this.filter();
            this.showedData = [];
            var startIndex : number = (page-1) * this.settings.pagination;
            var endIndex : number = startIndex + this.settings.pagination;
            for(var i = startIndex; i < endIndex; i++){
                if(i < allDataFiltered.length)
                    this.showedData.push(allDataFiltered[i]);
            }
        }
    }

    /*Metodo que reduce la tabla haciendo un AND con lo escrito en todos los filtros
        Devuelve las filas que cumplen la condicion
    */
    filter(): Array<any>{
        this.showedData = [];
        for(let element of this.data){
            var flag: Boolean = true;
            for(let column of this.settings.columns){
                var target: String = element[column.key].toString();
                if(!target.toLowerCase().includes(this.filterInputs.get(column.key).value.toLowerCase())){
                    flag=false;
                }
            }
            if(flag){
                this.showedData.push(element);
            }
        }
        /*Con la tabla reducida se actualiza el numero de paginas posibles
            y se ordena*/
        this.updatePages();
        this.sort();
        return this.showedData;
    }
    
    //Metodo que se ejecuta al escribir en un input de filtro
    filterEvent(){
        this.changePage(1);
    }

    /*Metodo que actualiza el numero de paginas que tiene la tabla
     y las paginas que se muestran*/
    updatePages(){

        //Actualizar numero de paginas
        /*Si todos los datos caben en una pagina
            solo hay una pagina*/
        if(this.showedData.length < this.settings.pagination){
            this.nPages = 1;
        }else{
            /*Si solo cabe un registro por pagina
            hay tantas paginas como registros*/
            if(this.settings.pagination === 1){
                this.nPages = this.showedData.length;
            }else{
                /*Si no calcular el numero de paginas redondeando por arriba
                    numPaginas = numRegistrosTotal partido numRegistroPorPagina */  
                this.nPages = Math.ceil(this.showedData.length/this.settings.pagination);
            }
        }

        //Cambiar el numero de las 3 paginas que se muestran
        /*Se pone en el centro la pagina actual
        siempre y cuando no se la primera o la ultima*/
        this.pages = [];
        var startPage;
        if(this.currentPage===1){
            startPage = this.currentPage;
        }else{
            startPage = this.currentPage-1
        }
        for(var i = startPage; i <= 3 ;i++){
            if(i<=this.nPages){
                this.pages.push(i);
            }
        }
    }

    /* Metodo que se ejecuta al clickar en el titulo de una columna
        Restablece el orden si se cambia de columna.
        Se fija la columna actual a ordenar.
        Cambia el estado de ordenacion de la tabla en el siguiente orden circular ASC -> DESC -> NO_ORDER.
        Cambia a la primera pagina para que se aplica los filtro y la ordenacion */
    sortEvent($event){        
        if(this.currentSort != "" && this.currentSort != $event.target.id){
            this.sorting = 0;
        }
        this.currentSort = $event.target.id;
        if(this.sorting === 0){
            this.sorting = 1;
        }else{
            if(this.sorting === 1){
                this.sorting = -1;
            }else{
                this.sorting = 0;
                this.currentSort = "";
            }
        }
        this.changePage(1);
    }

    /* Metodo que ordena los datos a mostrar segun el estado de ordenacion
        1: ASC
        -1: DESC */
    sort(){
        if(this.sorting === 1){
            this.showedData.sort((a,b) => {
                if(a[this.currentSort] > b[this.currentSort]){
                    return 1;
                }else{
                    if(a[this.currentSort] < b[this.currentSort]){
                        return -1;
                    }else{
                        return 0;
                    }
                }
            });
        }else{
            if(this.sorting === -1){
                this.showedData.sort((a,b) => {
                    if(a[this.currentSort] < b[this.currentSort]){
                        return 1;
                    }else{
                        if(a[this.currentSort] > b[this.currentSort]){
                            return -1;
                        }else{
                            return 0;
                        }
                    }
                });
            }
        }
    }

    add(){
        this.adding = true;
    }

    cancelAdd(){
        this.adding = false;
        this.createInputs.reset()
    }

    create(){
        var row = {};
        for(let column of this.settings.columns){
            row[column.key] = this.createInputs.get(column.key).value;
        }
        this.cancelAdd();
        this.created.emit(row);
    }

    delete(i){
        this.deleting = true;
        this.currentDelete = i;
    }

    cancelDelete(){
        this.deleting = false;
        this.currentDelete = null;
    }

    rowDeleted(row){
        this.cancelDelete();
        this.deleted.emit(row);
    }

    edit(row,i){
        
        this.editing = true;
        this.currentEdit = i;
        for(let column of this.settings.columns){
            this.editInputs.get(column.key).setValue(row[column.key]);
        }
    }

    cancelEdit(){
        this.editing = false;
        this.currentEdit = null;
    }

    rowEdited(oldRow){
        var newRow = {};
        for(let column of this.settings.columns){
            newRow[column.key] = this.editInputs.get(column.key).value;
        }
        this.cancelEdit();
        var res = { oldRow,newRow };
        this.edited.emit(res);
    }

    emitAction(actionKey,row){
        var res = { actionKey , row }
        this.actionEmitter.emit(res);
    }
}