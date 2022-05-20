
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { alertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@NgModule({
    declarations: [
        DropdownDirective,
        LoadingSpinnerComponent,
        alertComponent
      ],
      imports: [
        CommonModule
      ],
      exports: [
        DropdownDirective,
        LoadingSpinnerComponent,
        alertComponent,
        CommonModule
      ]
})
export class SharedModule{

}