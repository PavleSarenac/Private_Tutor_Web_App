import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.model';
import { User } from 'src/app/models/user.model';
import { DefaultService } from 'src/app/services/default/default.service';

@Component({
  selector: 'app-student-see-teacher-details',
  templateUrl: './student-see-teacher-details.component.html',
  styleUrls: ['./student-see-teacher-details.component.css', '../../../../../../styles.css']
})
export class StudentSeeTeacherDetailsComponent implements OnInit {
  teacher: User = new User()
  profilePictureUrl: any = null

  class: Class = new Class()

  constructor(private defaultService: DefaultService) { }

  ngOnInit(): void {
    this.defaultService.getUser(localStorage.getItem("studentSeeTeacherDetailsUsername")!).subscribe(
      (teacher) => {
        this.teacher = teacher
        this.initializeClass()
        this.defaultService.getProfilePicture(this.teacher.profilePicturePath).subscribe(
          (profilePictureFile: Blob) => {
            const fileReader = new FileReader()
            fileReader.onload = (e) => {
              this.profilePictureUrl = e.target?.result
            }
            fileReader.readAsDataURL(
              new Blob(
                [profilePictureFile],
                { type: "image/" + this.teacher.profilePicturePath.split(".").pop()?.toLocaleLowerCase() }
              )
            )
          }
        )
      }
    )
  }

  initializeClass() {
    this.class.teacher = this.teacher.username
    this.class.student = JSON.parse(localStorage.getItem("loggedInUser")!).username
    if (this.teacher.teacherSubjects.length == 1) this.class.subject = this.teacher.teacherSubjects[0]
  }

  updateChosenSubject(subject: string) {
    this.class.subject = subject
  }
}
