import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentInfoComponent } from './update-student-info.component';

describe('UpdateStudentInfoComponent', () => {
  let component: UpdateStudentInfoComponent;
  let fixture: ComponentFixture<UpdateStudentInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateStudentInfoComponent]
    });
    fixture = TestBed.createComponent(UpdateStudentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
