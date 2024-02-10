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
  profilePictureError: string = "Please upload an image in jpg/png format with size ranging from 100x100 px to 300x300 px."
  isInvalidImage: boolean = false
  schoolTypeError: string = "Please pick a school type."
  currentGradeError: string = "Please pick a grade."

  profilePictureFormData: FormData = new FormData()

  schoolTypes: string[] = ["Primary school", "Gymnasium", "Trade school", "Art school"]
  primarySchoolGrades: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];
  secondarySchoolGrades: string[] = ["1", "2", "3", "4"];


  constructor(private defaultService: DefaultService) { }

  ngOnInit(): void {
    this.setDefaultProfilePicture()
    this.setUserType()
  }

  setDefaultProfilePicture() {
    const defaultProfilePicturePath = "assets/images/good_images/good_image_1.jpg"
    fetch(defaultProfilePicturePath).then(
      response => response.blob()
    ).then(
      (blob: any) => {
        const defaultProfilePictureFile = new File([blob], "good_image_1.jpg")
        this.profilePictureFormData.append(
          "profilePicture",
          defaultProfilePictureFile as Blob,
          defaultProfilePictureFile.name
        )
      }
    )
  }

  setUserType() {
    this.newUser.userType = "student"
  }

  onImageSelected(event: any) {
    let profilePictureFile = event.target.files[0] as File
    if (!this.isValidImageFormat(profilePictureFile)) {
      this.isInvalidImage = true
      this.profilePictureError = "Please upload an image in jpg/png format with size ranging from 100x100 px to 300x300 px."
      return
    }
    this.isInvalidImage = false
    this.profilePictureFormData = new FormData()
    this.profilePictureFormData.append(
      "profilePicture",
      profilePictureFile as Blob,
      profilePictureFile.name
    )
  }

  isValidImageFormat(image: File): boolean {
    const allowedImageExtensions = ["jpg", "png"]
    const imageExtension = image.name.split(".").pop()?.toLocaleLowerCase()
    if (imageExtension == null) return false
    return allowedImageExtensions.includes(imageExtension)
  }

  updateSchoolType(schoolType: string) {
    this.newUser.currentGrade = ""
    this.newUser.schoolType = schoolType
  }

  updateCurrentGrade(currentGrade: string) {
    this.newUser.currentGrade = currentGrade
  }

  register() {
    if (!this.isRegistrationInputValid()) return
    this.defaultService.uploadProfilePicture(this.profilePictureFormData).subscribe(
      (message: Message) => {
        let responseType = message.content.split("|")[0]
        let response = message.content.split("|")[1]
        if (responseType == "ERROR") {
          this.profilePictureError = response
          this.isInvalidImage = true
        } else if (responseType == "FILEPATH") {
          this.newUser.profilePicturePath = response
          this.defaultService.register(this.newUser).subscribe(
            (message: Message) => {
              if (message.content.includes("username")) {
                this.usernameError = message.content
                this.newUser.username = ""
                return
              }
              if (message.content.includes("email")) {
                this.emailError = message.content
                this.newUser.email = ""
                return
              }
            }
          )
        }
      }
    )
  }

  isRegistrationInputValid(): boolean {
    if (this.isSomeInputDataMissing()) return false
    const isPasswordValid = this.isPasswordValid()
    const isPhoneValid = this.isPhoneValid()
    const isEmailValid = this.isEmailValid()
    return isPasswordValid && isPhoneValid && isEmailValid && !this.isInvalidImage
  }

  isSomeInputDataMissing(): boolean {
    return this.newUser.username == "" || this.newUser.password == ""
      || this.newUser.userType == "" || this.newUser.securityQuestion == ""
      || this.newUser.securityAnswer == "" || this.newUser.name == ""
      || this.newUser.surname == "" || this.newUser.gender == ""
      || this.newUser.address == "" || this.newUser.phone == ""
      || this.newUser.email == "" || this.newUser.schoolType == ""
      || this.newUser.currentGrade == ""
  }

  isEmailValid(): boolean {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    const isValid = emailRegex.test(this.newUser.email)
    if (!isValid) {
      this.emailError = "Invalid email format."
      this.newUser.email = ""
    }
    return isValid
  }

  isPasswordValid(): boolean {
    const passwordRegex = /^(?=[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z]).{6,10}$/
    const isValid = passwordRegex.test(this.newUser.password)
    if (!isValid) {
      this.passwordError = "Invalid password format."
      this.newUser.password = ""
    }
    return isValid
  }

  isPhoneValid(): boolean {
    const phoneRegex = /^06[0-6]\/[0-9]{3}-[0-9]{3,4}$/
    const isValid = phoneRegex.test(this.newUser.phone)
    if (!isValid) {
      this.phoneError = "Invalid phone format."
      this.newUser.phone = ""
    }
    return isValid
  }
}
