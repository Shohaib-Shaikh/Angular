import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAuthenticated: boolean = false;
  private userSub: Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService){}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;  
    });
  }



  saveData(){
    this.dataStorageService.storeRecipes();
  }


  fetchData(){
    this.dataStorageService.fetchRecipe().subscribe();
  }


  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
