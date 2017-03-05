/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JornadasComponent } from './jornadas.component';

describe('JornadasComponent', () => {
  let component: JornadasComponent;
  let fixture: ComponentFixture<JornadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JornadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JornadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
