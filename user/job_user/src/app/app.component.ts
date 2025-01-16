import { UserService } from './services/user.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: User | null = null;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    // Lấy candidate từ localStorage và gán vào biến `candidate`
    const userData = localStorage.getItem('user');
    if (userData) {
        this.user = JSON.parse(userData);
    }
  }

  title = 'job_user';

  async clearData(): Promise<void> {
    localStorage.removeItem('user');
    this.user = null;
    this.cdr.detectChanges();
    await this.router.navigate(['/']);
  }
}
