import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private userService: UserService) {}

  onLogin() {
    var user = {
      username: this.username,
      password: this.password,
    };
    this.userService.login(user).then(
      (res) => {
        console.log(res);
        if (res.status == true) {
          this.router.navigate(['/code']);
        } else {
          alert('Invalid credentials. Please try again.');
        }
      },
      (err) => {}
    );
  }
}
