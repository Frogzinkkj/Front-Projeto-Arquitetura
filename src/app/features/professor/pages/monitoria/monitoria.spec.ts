import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Monitoria } from './monitoria';

describe('Monitoria', () => {
  let component: Monitoria;
  let fixture: ComponentFixture<Monitoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Monitoria],
    }).compileComponents();

    fixture = TestBed.createComponent(Monitoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
