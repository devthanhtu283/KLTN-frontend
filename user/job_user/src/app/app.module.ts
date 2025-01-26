import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeekerHomeComponent } from './components/seeker/seeker-home/seeker-home.component';
import { UserService } from './services/user.service';
import { MessagesModule } from 'primeng/messages';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BaseUrlUserService } from './services/baseUrlUser.service';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DatePipe } from '@angular/common';
import { VerifyAccountComponent } from './components/seeker/verify/verify-account.component';
import { ForgotPasswordComponent } from './components/seeker/forgot-password/forgot-password.component';
import { SeekerDashboardComponent } from './components/seeker/seeker-dashboard/seeker-dashboard.component';
import { EmployerDashboardComponent } from './components/employer/dashboard/employer-dashboard.component';
import { EmployerChangePasswordComponent } from './components/employer/change-password/employer-change-password.component';
import { CandidateChangePasswordComponent } from './components/seeker/change-password/candidate-change-password.component';
import { CandidateProfilePasswordComponent } from './components/seeker/profile/candidate-profile.component';
import { SeekerRoot } from './roots/seeeker-root/seeker.root';
import { EmployerRoot } from './roots/employer-root/employer.root';
// import { MapComponent } from './components/test/map.component';


@NgModule({
  declarations: [
    AppComponent,

    ///////////////////
    SeekerRoot,
    SeekerHomeComponent,
    SeekerDashboardComponent,
    /////////////////

    /////////////////
    EmployerRoot,
    ////////////////



    VerifyAccountComponent,
    
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
    BaseUrlUserService,
    MessageService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
