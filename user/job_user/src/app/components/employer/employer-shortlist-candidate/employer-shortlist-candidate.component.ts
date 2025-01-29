import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Application } from "src/app/models/application.model";
import { User } from 'src/app/models/user.model';
import { ApplicationService } from "src/app/services/application.service";
import { UserService } from "src/app/services/user.service";

@Component({
    templateUrl: "./employer-shortlist-candidate.component.html",
    styleUrls: ['./employer-shortlist-candidate.component.css'],
  })
export class EmployerShortListCandidateComponent implements OnInit {

  applications: Application[];
  currentPage: number = 0;
  totalPages : number;
  pageSize : number;

  constructor(
    private userService: UserService,
    private applicationService: ApplicationService,
    private router: Router,

  ) {}
  user: User;
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      this.router.navigate(['/']); // Điều hướng lại nếu không tìm thấy user
    } else {
      this.user = user; // Gán dữ liệu người dùng
      this.loadData();
    }
  }

  loadData(): void {
    this.applicationService.findByEmployerId(this.user.id, this.currentPage, 2).then(
      (res) => {
        this.applications = res["data"]["content"];
        this.totalPages = res["data"]["totalPages"];
        this.pageSize = res["data"]["size"];
      }
    );
    
  }
  // Hàm để chuyển trang
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadData();
    }
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  
}