import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  private userSub!: Subscription;
  isAuthenticated= false;

@Output() featureSelected = new EventEmitter<string>();

 constructor(private dataStorageService: DataStorageService,private authService: AuthService ){}
 ngOnInit(){
   this.userSub= this.authService.user.subscribe(user =>
    {
      this.isAuthenticated=!!user; //!user ? false: true;
      console.log(!user);
      console.log(!!user);
    });
 }


  onSelect(feature :string)
  {
this.featureSelected.emit(feature);
  }

  onSaveRecipe(){
this.dataStorageService.storeRecipes();
  }
  onFetchRecipe(){
    this.dataStorageService.fetchRecipe().subscribe();
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authService.user.unsubscribe();
  }

}
