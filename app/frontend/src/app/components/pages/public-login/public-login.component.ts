import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { DefaultService } from 'src/app/services/default/default.service';

@Component({
  selector: 'app-public-login',
  templateUrl: './public-login.component.html',
  styleUrls: ['./public-login.component.css', '../../../../styles.css']
})
export class PublicLoginComponent {
  username: string = ""
  password: string = ""

  usernameError: string = "Please enter your username."
  passwordError: string = "Please enter your password."

  constructor(private deafultService: DefaultService, private router: Router) { }

  login() {
    if (this.username == "" || this.password == "") return
    this.deafultService.login(this.username, this.password).subscribe(
      (user: User) => {
        if (user == null) {
          this.usernameError = "Username or password is wrong."
          this.passwordError = "Username or password is wrong."
          this.username = ""
          this.password = ""
          return
        }
        localStorage.setItem("loggedInUser", JSON.stringify(user))
        if (user.userType == "student") {
          this.router.navigate(["student"])
        } else {
          this.router.navigate(["teacher"])
        }
      }
    )
  }
}
