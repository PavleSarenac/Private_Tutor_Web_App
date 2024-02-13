import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-header',
  templateUrl: './teacher-header.component.html',
  styleUrls: ['./teacher-header.component.css', '../../../../styles.css']
})
export class TeacherHeaderComponent {
  constructor(private router: Router) { }

  logout() {
    localStorage.clear()
    this.router.navigate([""])
  }
}
