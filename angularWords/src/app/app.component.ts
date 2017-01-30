import { Component, OnInit } from '@angular/core';
import { MenuComponent } from './menu/index';
import { TranslateService } from './translate';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
 
export class AppComponent implements OnInit{
    public supportedLangs: any[];

    constructor(private _translate: TranslateService) { }

    ngOnInit() {
        // standing data
        this.supportedLangs = [
        { display: 'en', value: 'en' },
        { display: 'es', value: 'es' },
        ];

        // set current langage
        this.selectLang('es');
    }

    isCurrentLang(lang: string) {
        // check if the selected lang is current lang
        return lang === this._translate.currentLang;
    }

    selectLang(lang: string) {
        // set current lang;
        this._translate.use(lang);
    }
 }