import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError,tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";



export interface AuthResonseData{
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered? : string;
}

@Injectable({providedIn: 'root'})
export class AuthService{

    private tokenExpirationTimer: any;

    user = new BehaviorSubject<User|null>(null);


    constructor(private http: HttpClient,private router: Router) {}


    signUp(email: string,password: string){
        return this.http.post<AuthResonseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseApiKey,
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        ).pipe(catchError(this.handleError),tap(resData => {
           this.handleAuthentication(resData.email,resData.localId,resData.idToken, +resData.expiresIn)
        }
        ));
    }

     login(email: string,password: string){
        return this.http.post<AuthResonseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseApiKey,
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError),tap(resData => {
            this.handleAuthentication(resData.email,resData.localId,resData.idToken, +resData.expiresIn)
         }));
     }

     logout(){
         this.user.next(null);
         this.router.navigate(['/auth']);
         localStorage.removeItem('userData');//To remove the local storage item
         if(this.tokenExpirationTimer){
             clearTimeout(this.tokenExpirationTimer);
         }
         this.tokenExpirationTimer=null;
     }

     autoLogout(expirationDuration : number){
         console.log(expirationDuration);
         this.tokenExpirationTimer = setTimeout( () => {// this function will logout after expiration duration completed
             this.logout();

         },expirationDuration)

     }

     autoLogin(){
         const userData: {
             email: string;
             id: string;
             _token: string;
             _tokenExpirationDate: string
           } = JSON.parse(localStorage.getItem('userData') || '{}'); //Converting the string back to Java script object which angular knows
         if(!userData){
             return;
         }
         const loadedUser= new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate))
           if(loadedUser.token){
               this.user.next(loadedUser); // To emit the loaded user as the new current user.
               const expirationDuration= new Date(userData._tokenExpirationDate).getTime() - new Date().getTime(); //future date - minus date in milliseconds
               this.autoLogout(expirationDuration);
           }
     }

     private handleAuthentication(email: string,userid: string,token:string, expiresIn:number){
        const expirationDate=new Date(new Date().getTime() + +expiresIn*1000);
        const user= new User(email,userid,token,expirationDate); //To create new user
        this.user.next(user);
        this.autoLogout(expiresIn*1000);
        localStorage.setItem('userData', JSON.stringify(user)); //After creating new user you can store it in browser local storage to prevent the user from page refresh

     }

     private handleError(errorRes: HttpErrorResponse){
        let errorMessage='An unknown error occurred'
        if(!errorRes.error || !errorRes.error.error)
        {
            return throwError(errorMessage);
        }
        switch(errorRes.error.error.message)
      {
        case 'EMAIL_EXISTS':
        errorMessage= 'This email exist already';
        break;
        case 'EMAIL_NOT_FOUND':
        errorMessage= 'This email not found';
        break;
        case 'INVALID_PASSWORD':
        errorMessage= 'Invalid password';
        break;

      }
      return throwError(errorMessage);
     }


}
