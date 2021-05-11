import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationCompareComponent } from './application-compare.component';

describe('ApplicationCompareComponent', () => {
  let component: ApplicationCompareComponent;
  let fixture: ComponentFixture<ApplicationCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationCompareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
