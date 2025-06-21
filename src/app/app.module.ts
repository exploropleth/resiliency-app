import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpErrorHandler } from "./http-error-handler.service";
import { FormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { TooltipModule } from 'primeng/tooltip';
import { ColorPickerModule } from 'primeng/colorpicker';

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
    NgbModule,
    CascadeSelectModule,
    TooltipModule,
    ColorPickerModule
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
