import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VerifyAccountComponent } from './components/verify/verify-account.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CandidateDashboardComponent } from './components/candidate/dashboard/candidate-dashboard.component';
import { EmployerDashboardComponent } from './components/employer/dashboard/employer-dashboard.component';
import { EmployerChangePasswordComponent } from './components/employer/change-password/employer-change-password.component';
import { CandidateChangePasswordComponent } from './components/candidate/change-password/candidate-change-password.component';
import { CandidateProfilePasswordComponent } from './components/candidate/profile/candidate-profile.component';
// import { MapComponent } from './components/test/map.component';


const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "verify-account",
    component: VerifyAccountComponent,
  },
  {
    path: "candidate-dashboard",
    component: CandidateDashboardComponent,
  },
  {
    path: "employer-dashboard",
    component: EmployerDashboardComponent,
  },
  {
    path: "employer-change-password",
    component: EmployerChangePasswordComponent,
  },
  {
    path: "candidate-change-password",
    component: CandidateChangePasswordComponent,
  },
  {
    path: "candidate-profile",
    component: CandidateProfilePasswordComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  // {
  //   path: "map",
  //   component: MapComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
