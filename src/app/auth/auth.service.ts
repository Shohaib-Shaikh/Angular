import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);
  token: string = null;
  private tokenExpirationTimer;

  constructor(private httpClient: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.httpClient
      .post<AuthResponsedata>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ environment.firebaseAPIkey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData',JSON.stringify(user));
  }

  login(email: string, password: string) {
    return this.httpClient
      .post<AuthResponsedata>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ environment.firebaseAPIkey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
            this.handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
          })
        );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email is exist. Try with another email';
        break;
      case 'INVALID_PASSWORD':
        errorMessage =
          'Invalid username or password. Please login with valid credentials';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
    }
    return throwError(errorMessage);
  }
  

  logout(){
    this.user.next(null);
    this.router.navigate(['./auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin(){
    const user: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if(!user){
      return;
    }else{
      const loadedUser = new User(user.email,user.id,user._token, new Date(user._tokenExpirationDate));
      if(loadedUser.token){
        this.user.next(loadedUser);
        const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }

    }

  }


  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logout();
    }, expirationDuration);

  }

}

export interface AuthResponsedata {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
