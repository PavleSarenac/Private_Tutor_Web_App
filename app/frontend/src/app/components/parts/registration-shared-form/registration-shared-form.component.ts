import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-registration-shared-form',
  templateUrl: './registration-shared-form.component.html',
  styleUrls: ['./registration-shared-form.component.css', '../../../../styles.css']
})
export class RegistrationSharedFormComponent {
  newUser: User = new User()

  successMessage: string = "Thanks!"

  usernameError: string = "Please enter a username."
  passwordError: string = "Please enter a password."
  securityQuestionError: string = "Please enter a security question."
  securityAnswerError: string = "Please enter a security answer."
  nameError: string = "Please enter a name."
  surnameError: string = "Please enter a surname."
  genderError: string = "Please choose a gender."
  addressError: string = "Please enter an address."
  phoneError: string = "Please enter a phone number."
  emailError: string = "Please enter an email address."

  register() {
    alert(this.newUser.gender)
  }
}
