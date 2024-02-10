import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/pages/guest/index/index.component';
import { PublicLoginComponent } from './components/pages/guest/public-login/public-login.component';
import { PrivateLoginComponent } from './components/pages/guest/private-login/private-login.component';
import { isStudentGuard } from './guards/is-student/is-student.guard';
import { isTeacherGuard } from './guards/is-teacher/is-teacher.guard';
import { isAdminGuard } from './guards/is-admin/is-admin.guard';
import { isGuestGuard } from './guards/is-guest/is-guest.guard';
import { TeacherRegistrationComponent } from './components/pages/guest/teacher-registration/teacher-registration.component';
import { StudentRegistrationComponent } from './components/pages/guest/student-registration/student-registration.component';
import { StudentIndexComponent } from './components/pages/user/student/student-index/student-index.component';
import { TeacherIndexComponent } from './components/pages/user/teacher/teacher-index/teacher-index.component';
import { AdminIndexComponent } from './components/pages/user/admin/admin-index/admin-index.component';

const routes: Routes = [
  { path: "", component: IndexComponent, canActivate: [isGuestGuard] },
  { path: "public-login", component: PublicLoginComponent, canActivate: [isGuestGuard] },
  { path: "private-login", component: PrivateLoginComponent, canActivate: [isGuestGuard] },
  { path: "student-index", component: StudentIndexComponent, canActivate: [isStudentGuard] },
  { path: "teacher-index", component: TeacherIndexComponent, canActivate: [isTeacherGuard] },
  { path: "admin-index", component: AdminIndexComponent, canActivate: [isAdminGuard] },
  { path: "teacher-registration", component: TeacherRegistrationComponent, canActivate: [isGuestGuard] },
  { path: "student-registration", component: StudentRegistrationComponent, canActivate: [isGuestGuard] },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
