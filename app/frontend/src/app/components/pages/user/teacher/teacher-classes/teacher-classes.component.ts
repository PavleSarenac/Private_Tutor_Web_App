import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Class } from 'src/app/models/class.model';
import { User } from 'src/app/models/user.model';
import { DefaultService } from 'src/app/services/default/default.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

const NUMBER_OF_MINUTES_IN_ONE_HOUR = 60
const MINIMUM_LENGTH_OF_A_WORKDAY_IN_MINUTES = 120

@Component({
  selector: 'app-teacher-classes',
  templateUrl: './teacher-classes.component.html',
  styleUrls: ['./teacher-classes.component.css']
})
export class TeacherClassesComponent implements OnInit {
  teacher: User = new User()

  successMessage: string = "Thanks!"

  daysInAWeek: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  shouldShowWorktimeForm: boolean = false
  workingDays: string[] = []
  worktimeStart: string = ""
  worktimeEnd: string = ""
  workingDaysError: string = "Please choose your working days."
  worktimeStartError: string = "Please choose a time at which your working day starts."
  worktimeEndError: string = "Please choose a time at which your working day ends."

  pendingClassRequests: Class[] = []
  shouldShowPendingClassRequests: boolean = false

  rejectionExplanationError: string = "Please explain why you are rejecting this class request."

  @ViewChild("closeRejectionExplanationModalButton") closeModal: ElementRef | undefined

  constructor(
    private defaultService: DefaultService,
    private teacherService: TeacherService
  ) { }

  ngOnInit(): void {
    this.defaultService.getUser(JSON.parse(localStorage.getItem("loggedInUser")!).username).subscribe(
      (teacher: User) => {
        this.teacher = teacher
        this.fetchPendingClassRequests()
      }
    )
  }

  hideRejectionExplanationModal() {
    this.closeModal!.nativeElement.click()
  }

  fetchPendingClassRequests() {
    this.teacherService.deleteExpiredClassRequests().subscribe(
      () => {
        this.teacherService.getAllPendingClassRequests(this.teacher.username).subscribe(
          (pendingClasses: Class[]) => {
            this.pendingClassRequests = pendingClasses
          }
        )
      }
    )
  }

  accept(classRequest: Class) {
    this.teacherService.acceptClassRequest(classRequest).subscribe(
      () => {
        this.fetchPendingClassRequests()
      }
    )
  }

  reject(classRequest: Class) {
    if (classRequest.rejectionReason == "") return
    this.teacherService.rejectClassRequest(classRequest).subscribe(
      () => {
        this.fetchPendingClassRequests()
        this.hideRejectionExplanationModal()
      }
    )
  }

  showPendingClassRequests() {
    this.fetchPendingClassRequests()
    this.shouldShowPendingClassRequests = true
  }

  hidePendingClassRequests() {
    this.shouldShowPendingClassRequests = false
  }

  showWorktimeForm() {
    this.shouldShowWorktimeForm = true
  }

  hideWorktimeForm() {
    this.shouldShowWorktimeForm = false
    this.workingDays = []
    this.workingDaysError = "Please choose your working days."
    this.worktimeStartError = "Please choose a time at which your working day starts."
    this.worktimeEndError = "Please choose a time at which your working day ends."
  }

  updateWorktime() {
    if (this.workingDays.length == 0 || this.worktimeStart == "" || this.worktimeEnd == "") return
    if (this.areWorkingHoursInvalid()) return
    this.teacher.workingDays = this.workingDays
    this.teacher.workingHours = this.worktimeStart + "-" + this.worktimeEnd
    this.teacherService.updateWorktime(this.teacher).subscribe(
      () => {
        this.workingDays = []
        this.worktimeStart = ""
        this.worktimeEnd = ""
        this.shouldShowWorktimeForm = false
      }
    )
  }

  areWorkingHoursInvalid(): boolean {
    if (this.worktimeStart == "00:00" && this.worktimeEnd == "00:00") return false
    if (this.worktimeStart >= this.worktimeEnd && this.worktimeEnd != "00:00") {
      this.worktimeStartError = "End of your working day has to be after the start of your working day!"
      this.worktimeEndError = "End of your working day has to be after the start of your working day!"
      this.worktimeStart = this.worktimeEnd = ""
      return true
    }
    let startHour = Number(this.worktimeStart.substring(0, this.worktimeStart.indexOf(":")))
    let startMinute = Number(this.worktimeStart.substring(this.worktimeStart.indexOf(":") + 1))
    let endHour = Number(this.worktimeEnd.substring(0, this.worktimeEnd.indexOf(":")))
    let endMinute = Number(this.worktimeEnd.substring(this.worktimeEnd.indexOf(":") + 1))
    if (!((startMinute == 0 || startMinute == 30) && (endMinute == 0 || endMinute == 30))) {
      this.worktimeStartError = "Start of your worktime has to be at the full hour or at the half-hour!"
      this.worktimeEndError = "End of your worktime has to be at the full hour or at the half-hour!"
      this.worktimeStart = this.worktimeEnd = ""
      return true
    }
    if (Math.abs((endHour * NUMBER_OF_MINUTES_IN_ONE_HOUR + endMinute) -
      (startHour * NUMBER_OF_MINUTES_IN_ONE_HOUR + startMinute)) < MINIMUM_LENGTH_OF_A_WORKDAY_IN_MINUTES) {
      this.worktimeStartError = "You have to work for at least 2 hours in your workday!"
      this.worktimeEndError = "You have to work for at least 2 hours in your workday!"
      this.worktimeStart = this.worktimeEnd = ""
      return true
    }
    return false
  }
}
