import { Component, OnInit } from '@angular/core';
import { Data } from 'src/app/models/data.model';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { DefaultService } from 'src/app/services/default/default.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../../../../styles.css']
})
export class IndexComponent implements OnInit {
  numberOfStudents: string = ""
  numberOfTeachers: string = ""
  data: Data = new Data()
  allTeachers: User[] = []

  constructor(
    private defaultService: DefaultService,
    private teacherService: TeacherService
  ) { }

  ngOnInit(): void {
    this.defaultService.getNumberOfStudents().subscribe(
      (message: Message) => {
        this.numberOfStudents = message.content
      }
    )
    this.defaultService.getNumberOfTeachers().subscribe(
      (message: Message) => {
        this.numberOfTeachers = message.content
      }
    )
    this.defaultService.getData().subscribe(
      (data: Data[]) => {
        this.data = data[0]
        this.teacherService.getAllActiveTeachers().subscribe(
          (teachers: User[]) => {
            this.allTeachers = teachers
          }
        )
      }
    )
  }
}
