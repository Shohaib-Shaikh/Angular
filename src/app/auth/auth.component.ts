import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponsedata, AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnDestroy{
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSub :  Subscription;


  constructor
  (private authService: AuthService, 
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver) {}

  onSwitchModel() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    
    let authObs : Observable<AuthResponsedata>;

    this.isLoading = true;    
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (data) => {
        this.isLoading = false;
        this.router.navigate(['./recipes']);
      },
      (errorRes) => {
        this.error = errorRes;
        this.showErrorAlert(errorRes);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  resetError(){
    this.error = null;
  }

  private showErrorAlert(message: string){
    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;

    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;

    this.closeSub = componentRef.instance.resetError.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });

  }

  ngOnDestroy(){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }
}
