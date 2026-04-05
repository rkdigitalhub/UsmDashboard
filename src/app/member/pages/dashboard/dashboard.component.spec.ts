import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    localStorage.setItem('currentUser', JSON.stringify({
      userId: 'USM78250',
      name: 'Biruntha',
      location: 'Kallakurichi',
      bankName: 'Federal bank',
      branch: 'Kallakurichi',
      schemeAmount: 12500,
      schemeName: 'Unispace',
      tenureMonths: 10
    }));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    localStorage.removeItem('currentUser');
  });
});
