import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/pages/index/index.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PublicLoginComponent } from './components/pages/public-login/public-login.component';
import { PrivateLoginComponent } from './components/pages/private-login/private-login.component';
import { FooterComponent } from './components/parts/footer/footer.component';
import { GuestHeaderComponent } from './components/parts/guest-header/guest-header.component';
import { StudentComponent } from './components/pages/student/student.component';
import { TeacherComponent } from './components/pages/teacher/teacher.component';
import { AdminComponent } from './components/pages/admin/admin.component';

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        PublicLoginComponent,
        PrivateLoginComponent,
        FooterComponent,
        GuestHeaderComponent,
        StudentComponent,
        TeacherComponent,
        AdminComponent
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
