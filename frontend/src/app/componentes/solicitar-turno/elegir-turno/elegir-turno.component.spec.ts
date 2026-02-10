import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElegirTurnoComponent } from './elegir-turno.component';

describe('ElegirTurnoComponent', () => {
  let component: ElegirTurnoComponent;
  let fixture: ComponentFixture<ElegirTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElegirTurnoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElegirTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
