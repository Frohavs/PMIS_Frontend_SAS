import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NewAuthHTTPService } from 'src/app/services/new-auth.service';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: any) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private newAuthHTTPService: NewAuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    // const subscr = this.getUserByToken().subscribe();
    // this.unsubscribe.push(subscr);
    const subscr2 = this.getUserById().subscribe();
    this.unsubscribe.push(subscr2);
  }

  // public methods
  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.newAuthHTTPService.login(email, password).pipe(
      map((auth: {data: AuthModel, message: string}) => {
        const result = this.setAuthFromLocalStorage(auth.data);
        return result;
      }),
      switchMap(() => this.getUserById()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  // getUserByToken(): Observable<UserType> {
  //   const auth = this.getAuthFromLocalStorage();
  //   if (!auth || !auth.token) {
  //     return of(undefined);
  //   }

  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.getUserByToken(auth.token).pipe(
  //     map((user: any) => {
  //       debugger
  //       if (user) {
  //         this.currentUserSubject.next(user);
  //       } else {
  //         this.logout();
  //       }
  //       return user;
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }
  getUserById(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.id) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.newAuthHTTPService.getUserById(auth).pipe(
      map((user: any) => {
        if (user && user.data) {
          this.currentUserSubject.next(user.data);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(data: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (data && data.token) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(data));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): any { // AuthModel | undefined
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
