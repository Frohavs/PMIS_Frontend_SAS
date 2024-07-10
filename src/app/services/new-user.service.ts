import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IUserModel {

  id: string,
  userName: string,
  email: string,
  departmentId: number,
  lastActivity: string,
  role: string
}

@Injectable({
  providedIn: 'root'
})
export class NewUserService {

  API_USERS_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getUser(id: string): Observable<any> {
    const url = `${this.API_USERS_URL}/GetUser/${id}`;
    return this.http.get<IUserModel>(url);
  }
}
