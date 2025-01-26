import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeekerHomeComponent } from './components/seeker/seeker-home/seeker-home.component';
import { VerifyAccountComponent } from './components/seeker/verify/verify-account.component';
import { ForgotPasswordComponent } from './components/seeker/forgot-password/forgot-password.component';
import { SeekerDashboardComponent } from './components/seeker/seeker-dashboard/seeker-dashboard.component';
import { EmployerDashboardComponent } from './components/employer/dashboard/employer-dashboard.component';
import { EmployerChangePasswordComponent } from './components/employer/change-password/employer-change-password.component';
import { CandidateChangePasswordComponent } from './components/seeker/change-password/candidate-change-password.component';
import { CandidateProfilePasswordComponent } from './components/seeker/profile/candidate-profile.component';
import { SeekerRoot } from './roots/seeeker-root/seeker.root';
import { EmployerRoot } from './roots/employer-root/employer.root';
import { HomeEmployerComponent } from './components/employer/home-employer/home-employer.component';
// import { MapComponent } from './components/test/map.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/seeker',
    pathMatch: 'full'
  },
  {
    path: 'seeker',
    component: SeekerRoot,
    children: [
      {
        path: "home",
        component: SeekerHomeComponent,
      },
      {
        path: "",
        component: SeekerHomeComponent,
      },
      {
        path: "dashboard",
        component: SeekerDashboardComponent,
      },



      


      //////////////////////////////////////////
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
    ]
  },

  {
    path: "employer",
    component: EmployerRoot,
    children: [
      {
        path: "",
        component: HomeEmployerComponent,
      },
      {
        path: "home",
        component: HomeEmployerComponent,
      },
    ]
  },


  {
    path: "verify-account",
    component: VerifyAccountComponent,
  },
 
  {
    path: "employer-dashboard",
    component: EmployerDashboardComponent,
  },
  {
    path: "employer-change-password",
    component: EmployerChangePasswordComponent,
  }
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
