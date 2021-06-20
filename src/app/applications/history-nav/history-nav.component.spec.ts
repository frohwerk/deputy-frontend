import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryNavComponent } from './history-nav.component';

describe('HistoryNavComponent', () => {
  let component: HistoryNavComponent;
  let fixture: ComponentFixture<HistoryNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
