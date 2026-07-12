import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvDetailsComponent } from './tv-details.component';

describe('TvDetailsComponent', () => {
  let component: TvDetailsComponent;
  let fixture: ComponentFixture<TvDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TvDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
