import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClockifyPipe } from './clockify.pipe';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [AppComponent, TimerComponent, ClockifyPipe],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
