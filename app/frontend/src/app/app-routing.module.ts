import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/pages/index/index.component';
import { PublicLoginComponent } from './components/pages/public-login/public-login.component';
import { StudentComponent } from './components/pages/student/student.component';
import { TeacherComponent } from './components/pages/teacher/teacher.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { PrivateLoginComponent } from './components/pages/private-login/private-login.component';
import { isStudentGuard } from './guards/is-student/is-student.guard';
import { isTeacherGuard } from './guards/is-teacher/is-teacher.guard';
import { isAdminGuard } from './guards/is-admin/is-admin.guard';
import { isGuestGuard } from './guards/is-guest/is-guest.guard';
import { TeacherRegistrationComponent } from './components/pages/teacher-registration/teacher-registration.component';
import { StudentRegistrationComponent } from './components/pages/student-registration/student-registration.component';

const routes: Routes = [
  { path: "", component: IndexComponent, canActivate: [isGuestGuard] },
  { path: "public-login", component: PublicLoginComponent, canActivate: [isGuestGuard] },
  { path: "private-login", component: PrivateLoginComponent, canActivate: [isGuestGuard] },
  { path: "student", component: StudentComponent, canActivate: [isStudentGuard] },
  { path: "teacher", component: TeacherComponent, canActivate: [isTeacherGuard] },
  { path: "admin", component: AdminComponent, canActivate: [isAdminGuard] },
  { path: "teacher-registration", component: TeacherRegistrationComponent, canActivate: [isGuestGuard] },
  { path: "student-registration", component: StudentRegistrationComponent, canActivate: [isGuestGuard] },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
