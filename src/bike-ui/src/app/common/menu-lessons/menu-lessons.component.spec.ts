import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLessonsComponent } from './menu-lessons.component';

describe('MenuLessonsComponent', () => {
  let component: MenuLessonsComponent;
  let fixture: ComponentFixture<MenuLessonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuLessonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
