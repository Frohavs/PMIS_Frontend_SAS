import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../modules/auth';

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
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient, private authService: AuthService) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
    console.log(this.token);
   }

  getUser(id: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetUser/${id}`;
    return this.http.get<IUserModel>(url,{
      headers: httpHeaders
    });
  }
}
