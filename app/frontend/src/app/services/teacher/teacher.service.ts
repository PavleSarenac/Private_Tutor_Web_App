import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/app/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  backendUrl = "http://localhost:4000/teacher"

  constructor(private httpClient: HttpClient) { }

  uploadCv(formData: FormData) {
    return this.httpClient.post<Message>(`${this.backendUrl}/uploadCv`, formData)
  }
}
