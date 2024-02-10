import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/pages/guest/index/index.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PublicLoginComponent } from './components/pages/guest/public-login/public-login.component';
import { PrivateLoginComponent } from './components/pages/guest/private-login/private-login.component';
import { FooterComponent } from './components/parts/footer/footer.component';
import { GuestHeaderComponent } from './components/parts/guest-header/guest-header.component';
import { LoginFormComponent } from './components/parts/login-form/login-form.component';
import { TeacherRegistrationComponent } from './components/pages/guest/teacher-registration/teacher-registration.component';
import { StudentRegistrationComponent } from './components/pages/guest/student-registration/student-registration.component';
import { RegistrationSharedFormComponent } from './components/parts/registration-shared-form/registration-shared-form.component';
import { AdminIndexComponent } from './components/pages/user/admin/admin-index/admin-index.component';
import { StudentIndexComponent } from './components/pages/user/student/student-index/student-index.component';
import { TeacherIndexComponent } from './components/pages/user/teacher/teacher-index/teacher-index.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    PublicLoginComponent,
    PrivateLoginComponent,
    FooterComponent,
    GuestHeaderComponent,
    LoginFormComponent,
    TeacherRegistrationComponent,
    StudentRegistrationComponent,
    RegistrationSharedFormComponent,
    AdminIndexComponent,
    StudentIndexComponent,
    TeacherIndexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
