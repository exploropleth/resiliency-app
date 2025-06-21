import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpErrorHandler } from "./http-error-handler.service";
import { FormsModule } from "@angular/forms";
import { TooltipModule } from 'ng2-tooltip-directive';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CascadeSelectModule } from 'primeng/cascadeselect';

// Local
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MainComponent } from "./pages/app/component";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TooltipModule,
    ColorPickerModule,
    NgbModule,
    CascadeSelectModule
  ],
  declarations: [
    AppComponent,
    MainComponent
  ],
  providers: [
    HttpErrorHandler,
    MainComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
