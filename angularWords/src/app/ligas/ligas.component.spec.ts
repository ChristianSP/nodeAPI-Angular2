/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LigasComponent } from './ligas.component';

describe('LigasComponent', () => {
  let component: LigasComponent;
  let fixture: ComponentFixture<LigasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LigasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LigasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
