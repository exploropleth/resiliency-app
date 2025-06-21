import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
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

@NgModule({ declarations: [
        AppComponent,
        MainComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        AppRoutingModule,
        NgbModule,
        CascadeSelectModule,
        TooltipModule,
        ColorPickerModule], providers: [
        HttpErrorHandler,
        MainComponent,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {}
