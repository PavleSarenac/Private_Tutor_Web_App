import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  backendUrl = "http://localhost:4000/teacher"

  constructor(private httpClient: HttpClient) { }

  uploadCv(formData: FormData) {
    return this.httpClient.post<Message>(`${this.backendUrl}/uploadCv`, formData)
  }

  getAllActiveTeachers() {
    return this.httpClient.get<User[]>(`${this.backendUrl}/getAllActiveTeachers`)
  }

  getAllPendingTeachers() {
    return this.httpClient.get<User[]>(`${this.backendUrl}/getAllPendingTeachers`)
  }

  updateTeacherInfo(teacher: User) {
    return this.httpClient.post<Message>(`${this.backendUrl}/updateTeacherInfo`, teacher)
  }
}
