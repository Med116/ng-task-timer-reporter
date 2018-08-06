import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { MatDialogModule } from "@angular/material";
  
import { AppComponent } from './app.component';
import { SecondsToHumanTimePipe } from './seconds-to-human-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SecondsToHumanTimePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    //MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
