import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthModel } from '../modules/auth/models/auth.model';
import { UserType } from '../modules/auth';

@Injectable({
  providedIn: 'root',
})
export class NewAuthHTTPService implements OnDestroy {

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  API_USERS_URL = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_USERS_URL}/Login`, {
      email,
      password,
    });
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.API_USERS_URL}/ForgetPassword`, {
      email,
    });
  }


  getUserById(auth: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.token}`,
    });

    return this.http.get<any>(`${this.API_USERS_URL}/Get/${auth.id}`, {
      headers: httpHeaders,
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
