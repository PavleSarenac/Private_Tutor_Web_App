import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
