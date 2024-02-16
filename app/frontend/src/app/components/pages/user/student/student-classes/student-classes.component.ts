import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.model';
import { User } from 'src/app/models/user.model';
import { DefaultService } from 'src/app/services/default/default.service';
import { StudentService } from 'src/app/services/student/student.service';

const NUMBER_OF_MINUTES_IN_ONE_HOUR = 60
const NUMBER_OF_SECONDS_IN_ONE_MINUTE = 60
const NUMBER_OF_MILLISECONDS_IN_ONE_SECOND = 1000

const NUMBER_OF_MILLISECONDS_IN_ONE_HOUR =
  NUMBER_OF_MINUTES_IN_ONE_HOUR * NUMBER_OF_SECONDS_IN_ONE_MINUTE * NUMBER_OF_MILLISECONDS_IN_ONE_SECOND

@Component({
  selector: 'app-student-classes',
  templateUrl: './student-classes.component.html',
  styleUrls: ['./student-classes.component.css']
})
export class StudentClassesComponent implements OnInit {
  student: User = new User()

  allUpcomingClasses: Class[] = []
  shouldShowUpcomingClasses: boolean = false

  constructor(
    private studentService: StudentService,
    private defaultService: DefaultService
  ) { }

  ngOnInit(): void {
    this.defaultService.getUser(JSON.parse(localStorage.getItem("loggedInUser")!).username).subscribe(
      (student: User) => {
        this.student = student
        this.studentService.getAllUpcomingClasses(this.student.username).subscribe(
          (upcomingClasses: Class[]) => {
            this.allUpcomingClasses = upcomingClasses
          }
        )
      }
    )
  }

  getTimeDifferenceInMinutes(classStartDate: string, classStartTime: string): number {
    let classDateTimeStringIsoFormat = classStartDate + "T" + classStartTime + ":00.000Z"
    let classDateTimeMillis = new Date(classDateTimeStringIsoFormat).getTime()
    let currentDateTimeMillis = Date.now() + NUMBER_OF_MILLISECONDS_IN_ONE_HOUR
    let timeDifferenceInMinutes = (classDateTimeMillis - currentDateTimeMillis) / (NUMBER_OF_MILLISECONDS_IN_ONE_SECOND * NUMBER_OF_SECONDS_IN_ONE_MINUTE)
    return timeDifferenceInMinutes
  }

  showUpcomingClasses() {
    this.shouldShowUpcomingClasses = true
  }

  hideUpcomingClasses() {
    this.shouldShowUpcomingClasses = false
  }
}
