import { Component, OnInit } from '@angular/core';
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

  constructor(private defaultService: DefaultService) { }

  ngOnInit(): void {
    this.defaultService.getUser(localStorage.getItem("studentSeeTeacherDetailsUsername")!).subscribe(
      (teacher) => {
        this.teacher = teacher
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
}
