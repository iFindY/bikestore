import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPathComponent } from './current-path.component';

describe('CurrentPathComponent', () => {
  let component: CurrentPathComponent;
  let fixture: ComponentFixture<CurrentPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
