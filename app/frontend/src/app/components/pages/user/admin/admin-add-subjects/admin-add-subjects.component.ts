import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/models/data.model';
import { AdminService } from 'src/app/services/admin/admin.service';
import { DefaultService } from 'src/app/services/default/default.service';

@Component({
  selector: 'app-admin-add-subjects',
  templateUrl: './admin-add-subjects.component.html',
  styleUrls: ['./admin-add-subjects.component.css', '../../../../../../styles.css']
})
export class AdminAddSubjectsComponent implements OnInit {
  newSubjects: string[] = []
  newSubject: string = ""
  error: string = "This subject already exists in the database."
  showError: boolean = false

  constructor(
    private adminService: AdminService,
    private defaultService: DefaultService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData() {
    this.defaultService.getData().subscribe(
      (data: Data[]) => {
        this.newSubjects = data[0].subjects
      }
    )
  }

  addSubject() {
    this.showError = false
    if (this.newSubject == "") return
    if (!this.newSubjects.includes(this.newSubject)) {
      this.newSubjects.push(this.newSubject)
    } else {
      this.showError = true
    }
  }

  confirm() {
    this.adminService.updateSubjects(this.newSubjects).subscribe(
      () => {
        this.router.navigate(["admin-index"])
      }
    )
  }
}
