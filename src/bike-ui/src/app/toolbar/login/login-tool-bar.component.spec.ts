import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTooolBarComponent } from './login-toool-bar.component';

describe('LoginComponent', () => {
  let component: LoginTooolBarComponent;
  let fixture: ComponentFixture<LoginTooolBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginTooolBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginTooolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
