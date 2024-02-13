import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DefaultService } from 'src/app/services/default/default.service';
import { StudentService } from 'src/app/services/student/student.service';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-admin-all-teachers',
  templateUrl: './admin-all-teachers.component.html',
  styleUrls: ['./admin-all-teachers.component.css', '../../../../../../styles.css']
})
export class AdminAllTeachersComponent implements OnInit {
  allTeachersData: any[] = []

  private ngUnsubscribe = new Subject<void>();

  constructor(private teacherService: TeacherService, private defaultService: DefaultService) { }

  ngOnInit(): void {
    this.teacherService.getAllTeachers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (teachers: User[]) => {
          const requests = teachers.map((teacher: User) =>
            this.defaultService.getProfilePicture(teacher.profilePicturePath)
              .pipe(
                catchError((error) => {
                  console.error(`Error loading picture for student ${teacher.username}:`, error);
                  // Returning an observable with `null` to keep the array length consistent
                  return of(null);
                })
              )
          );

          forkJoin(requests).subscribe(
            (profilePictures: Blob[] | any) => {
              teachers.forEach((teacher, index) => {
                const profilePictureFile = profilePictures[index];
                if (profilePictureFile) {
                  const fileReader = new FileReader();
                  fileReader.onload = (e) => {
                    this.allTeachersData.push(
                      {
                        teacher: teacher,
                        profilePictureUrl: e.target?.result
                      }
                    )
                  };
                  fileReader.readAsDataURL(
                    new Blob(
                      [profilePictureFile],
                      { type: 'image/' + teacher.profilePicturePath.split('.').pop()?.toLocaleLowerCase() }
                    )
                  );
                }
              });
            }
          );
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
