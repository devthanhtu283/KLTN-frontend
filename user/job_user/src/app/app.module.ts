import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { UserService } from './services/user.service';
import { MessagesModule } from 'primeng/messages';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BaseUrlService } from './services/baseUrl.service';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DatePipe } from '@angular/common';
import { VerifyAccountComponent } from './components/verify/verify-account.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CandidateDashboardComponent } from './components/candidate/dashboard/candidate-dashboard.component';
import { EmployerDashboardComponent } from './components/employer/dashboard/employer-dashboard.component';
import { EmployerChangePasswordComponent } from './components/employer/change-password/employer-change-password.component';
import { CandidateChangePasswordComponent } from './components/candidate/change-password/candidate-change-password.component';
import { CandidateProfilePasswordComponent } from './components/candidate/profile/candidate-profile.component';
// import { MapComponent } from './components/test/map.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VerifyAccountComponent,
    CandidateDashboardComponent,
    EmployerDashboardComponent,
    ForgotPasswordComponent,
    EmployerChangePasswordComponent,
    CandidateChangePasswordComponent,
    CandidateProfilePasswordComponent,
    // MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule  
  ],
  providers: [
    UserService,
    MessagesModule,
    BaseUrlService,
    MessageService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
