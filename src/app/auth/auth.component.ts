import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService ,AuthResonseData} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent  {


  constructor(private authService: AuthService, private router: Router){}
  isLoginMode= false;
  isLoading=false;
  error!: string|null;

  onSwitchMode(){
    this.isLoginMode= !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    let authObs: Observable<AuthResonseData>;
    const email= form.value.email;
    const password=form.value.password;
    this.isLoading=true;
    if(this.isLoginMode){
      authObs= this.authService.login(email,password)
    }
    else{
      authObs= this.authService.signUp(email,password)
    }

    authObs.subscribe(resData =>{
      console.log(resData);
      this.isLoading=false;
      this.router.navigate(['/recipes']);
     },
      errorMessage => {
        console.log(errorMessage);
       this.error=errorMessage;
        this.isLoading=false;
      }

      );
    form.reset();
  }
  
  onHandleError(){
    this.error=null;
  }
}
