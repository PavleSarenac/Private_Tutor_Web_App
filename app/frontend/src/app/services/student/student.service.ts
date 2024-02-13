import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  backendUrl = "http://localhost:4000/student"

  constructor(private httpClient: HttpClient) { }

  updateStudentInfo(user: User) {
    return this.httpClient.post<Message>(`${this.backendUrl}/updateStudentInfo`, user)
  }

  getAllStudents() {
    return this.httpClient.get<User[]>(`${this.backendUrl}/getAllStudents`)
  }
}
