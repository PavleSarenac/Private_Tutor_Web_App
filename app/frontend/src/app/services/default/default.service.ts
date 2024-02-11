import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DefaultService {
  backendUrl = "http://localhost:4000"

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string) {
    const body = {
      username: username,
      password: password
    }
    return this.httpClient.post<User>(`${this.backendUrl}/login`, body)
  }

  uploadProfilePicture(formData: FormData) {
    return this.httpClient.post<Message>(`${this.backendUrl}/uploadProfilePicture`, formData)
  }

  register(user: User) {
    return this.httpClient.post<Message>(`${this.backendUrl}/register`, user)
  }

  getNumberOfStudents() {
    return this.httpClient.get<Message>(`${this.backendUrl}/getNumberOfStudents`)
  }

  checkOldPassword(username: string, oldPassword: string) {
    const body = {
      username: username,
      oldPassword: oldPassword
    }
    return this.httpClient.post<User>(`${this.backendUrl}/checkOldPassword`, body)
  }

  changePassword(username: string, newPassword: string) {
    const body = {
      username: username,
      newPassword: newPassword
    }
    return this.httpClient.post<User>(`${this.backendUrl}/changePassword`, body)
  }

  getUser(username: string) {
    return this.httpClient.get<User>(`${this.backendUrl}/getUser?username=${username}`)
  }
}
