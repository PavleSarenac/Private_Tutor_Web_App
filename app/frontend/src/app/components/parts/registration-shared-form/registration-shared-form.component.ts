import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  teacherSubjectsError: string = "Please choose at least one subject."
  teacherPreferredStudentsAgeError: string = "Please choose at least one student age."
  teacherWhereDidYouHearAboutUsError: string = "Please tell us where you heard about us."
  cvError: string = "Please upload your CV in pdf format with maximum size of 3 MB."
  isInvalidCv: boolean = true

  profilePictureFormData: FormData = new FormData()
  cvFormData: FormData = new FormData()

  schoolTypes: string[] = ["Primary school", "Gymnasium", "Trade school", "Art school"]
  primarySchoolGrades: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"]
  secondarySchoolGrades: string[] = ["1", "2", "3", "4"]

  subjects = ["Mathematics", "Physics", "Chemistry", "Informatics", "Programming", "Serbian Language and Literature", "English Language", "German Language", "Italian Language", "French Language", "Spanish Language", "Latin Language", "Biology", "History", "Geography", "World Around Us"]
  studentAges = ["Primary School (Grades: 1-4)", "Primary School (Grades: 5-8)", "Secondary School"]

  teacherCustomSubject: string = ""
  teacherCustomSubjects: string[] = []

  constructor(private defaultService: DefaultService, private router: Router) { }

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
    if (this.router.routerState.snapshot.url == "/student-registration")
      this.newUser.userType = "student"
    else
      this.newUser.userType = "teacher"
  }

  onImageSelected(event: any) {
    let profilePictureFile = event.target.files[0] as File
    if (!this.isValidFileFormat(profilePictureFile, ["jpg", "png"])) {
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

  onCvSelected(event: any) {
    let cvFile = event.target.files[0] as File
    if (!this.isValidFileFormat(cvFile, ["pdf"])) {
      this.isInvalidCv = true
      this.cvError = "Please upload your CV in pdf format with maximum size of 3 MB."
      return
    }
    this.isInvalidCv = false
    this.cvFormData = new FormData()
    this.cvFormData.append(
      "cv",
      cvFile as Blob,
      cvFile.name
    )
  }

  isValidFileFormat(file: File, allowedFileExtensions: string[]): boolean {
    const fileExtension = file.name.split(".").pop()?.toLocaleLowerCase()
    if (fileExtension == null) return false
    return allowedFileExtensions.includes(fileExtension)
  }

  updateSchoolType(schoolType: string) {
    this.newUser.currentGrade = ""
    this.newUser.schoolType = schoolType
  }

  updateCurrentGrade(currentGrade: string) {
    this.newUser.currentGrade = currentGrade
  }

  addCustomSubject() {
    this.teacherCustomSubjects.push(this.teacherCustomSubject)
    this.teacherCustomSubject = ""
  }

  register() {
    if (!this.isRegistrationInputValid()) return
    if (this.newUser.userType == "teacher") this.mergeCustomWithDefaultSubjects()
    this.defaultService.uploadProfilePicture(this.profilePictureFormData).subscribe(
      (imageMessage: Message) => {
        if (this.didProfilePictureUploadFail(imageMessage)) return
        if (this.newUser.userType == "teacher") {
          this.defaultService.uploadCv(this.cvFormData).subscribe(
            (cvMessage: Message) => {
              if (this.didCvUploadFail(cvMessage)) return
              this.tryToRegister()
            }
          )
        } else {
          this.tryToRegister()
        }
      }
    )
  }

  mergeCustomWithDefaultSubjects() {
    this.teacherCustomSubjects.forEach((subject) => this.newUser.teacherSubjects.push(subject))
  }

  didProfilePictureUploadFail(imageMessage: Message): boolean {
    let responseType = imageMessage.content.split("|")[0]
    let response = imageMessage.content.split("|")[1]
    if (responseType == "ERROR") {
      this.profilePictureError = response
      this.isInvalidImage = true
      return true
    }
    this.newUser.profilePicturePath = response
    return false
  }

  didCvUploadFail(cvMessage: Message): boolean {
    let responseType = cvMessage.content.split("|")[0]
    let response = cvMessage.content.split("|")[1]
    if (responseType == "ERROR") {
      this.cvError = response
      this.isInvalidCv = true
      return true
    }
    this.newUser.cvPath = response
    return false
  }

  tryToRegister() {
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
        this.router.navigate(["public-login"])
      }
    )
  }

  isRegistrationInputValid(): boolean {
    if (this.newUser.userType == "student" && this.isSomeInputDataMissingStudent()) return false
    if (this.newUser.userType == "teacher" && this.isSomeInputDataMissingTeacher()) return false
    const isPasswordValid = this.isPasswordValid()
    const isPhoneValid = this.isPhoneValid()
    const isEmailValid = this.isEmailValid()
    return isPasswordValid && isPhoneValid && isEmailValid && !this.isInvalidImage &&
      (this.newUser.userType == "teacher" ? !this.isInvalidCv : true)
  }

  isSomeInputDataMissingShared(): boolean {
    return this.newUser.username == "" || this.newUser.password == ""
      || this.newUser.userType == "" || this.newUser.securityQuestion == ""
      || this.newUser.securityAnswer == "" || this.newUser.name == ""
      || this.newUser.surname == "" || this.newUser.gender == ""
      || this.newUser.address == "" || this.newUser.phone == ""
      || this.newUser.email == ""
  }

  isSomeInputDataMissingStudent(): boolean {
    return this.isSomeInputDataMissingShared() || this.newUser.schoolType == "" || this.newUser.currentGrade == ""
  }

  isSomeInputDataMissingTeacher(): boolean {
    return this.isSomeInputDataMissingShared() || this.newUser.teacherSubjects.length == 0
      || this.newUser.teacherPreferredStudentsAge.length == 0 || this.newUser.teacherWhereDidYouHearAboutUs == ""
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
