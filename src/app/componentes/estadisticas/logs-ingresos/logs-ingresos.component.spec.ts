import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsIngresosComponent } from './logs-ingresos.component';

describe('LogsIngresosComponent', () => {
  let component: LogsIngresosComponent;
  let fixture: ComponentFixture<LogsIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsIngresosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogsIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
