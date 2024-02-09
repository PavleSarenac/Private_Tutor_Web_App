import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { DefaultService } from 'src/app/services/default/default.service';

@Component({
  selector: 'app-registration-shared-form',
  templateUrl: './registration-shared-form.component.html',
  styleUrls: ['./registration-shared-form.component.css', '../../../../styles.css']
})
export class RegistrationSharedFormComponent implements OnInit {
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

  profilePictureFormData: FormData = new FormData()

  constructor(private defaultService: DefaultService) { }

  ngOnInit(): void {
    this.setDefaultProfilePicture()
  }

  setDefaultProfilePicture() {
    const defaultProfilePicturePath = "assets/photos/default-user.png"
    fetch(defaultProfilePicturePath).then(
      response => response.blob()
    ).then(
      (blob: any) => {
        const defaultProfilePictureFile = new File([blob], "default-user.png")
        this.profilePictureFormData.append(
          "profilePicture",
          defaultProfilePictureFile as Blob,
          defaultProfilePictureFile.name
        )
      }
    )
  }

  onImageSelected(event: any) {
    this.profilePictureFormData = new FormData()
    let profilePictureFile = event.target.files[0] as File
    this.profilePictureFormData.append(
      "profilePicture",
      profilePictureFile as Blob,
      profilePictureFile.name
    )
  }

  register() {
    this.defaultService.register(this.profilePictureFormData).subscribe(
      (message: Message) => {
        if (message.content == "ok")
          alert("Registrovan!")
      }
    )
  }
}
