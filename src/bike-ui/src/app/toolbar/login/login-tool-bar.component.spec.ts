import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginToolBarComponent } from './login-tool-bar.component';

describe('LoginComponent', () => {
  let component: LoginToolBarComponent;
  let fixture: ComponentFixture<LoginToolBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginToolBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
