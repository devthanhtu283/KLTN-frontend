import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Interview } from "src/app/models/interview.model";
import { User } from 'src/app/models/user.model';
import { ApplicationService } from "src/app/services/application.service";
import { UserService } from "src/app/services/user.service";

@Component({
    templateUrl: "./employer-meeting.component.html",
    styleUrls: ['./employer-meeting.component.css'],
  })
export class EmployerMeetingComponent implements OnInit {
  
  interviews: Interview [];
  interview: Interview;
  totalApplications: number;
  currentPage: number = 0;
  totalPages: number;
  pageSize: number;

  showConfirmModal: boolean = false;
  selectedInterviewId: number;
  selectedStatus: number;

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
    const pageSize = 10; 
    this.applicationService
      .listInterviewOfEmployer(this.user.id, this.currentPage)
      .then((res) => {
        const allInterviews = res['data']['content']; 
        this.totalApplications = res['data']['totalElements'];
        this.totalPages = Math.ceil(this.totalApplications / pageSize); 
        this.pageSize = pageSize;
  
        const startIndex = this.currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        this.interviews = allInterviews.slice(startIndex, endIndex); 
      });
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


   openConfirmModal(interviewId: number, status: number): void {
  this.selectedInterviewId = interviewId;
  this.selectedStatus = status;
  this.showConfirmModal = true; // Hiển thị modal xác nhận
}

  confirmUpdateStatus(): void {
    let interviewUpdated = {
      id: this.selectedInterviewId,
      status: this.selectedStatus
    };
    this.applicationService.update(interviewUpdated).then(
      (res) => {
        console.log('Cập nhật trạng thái thành công:', res);
        this.showConfirmModal = false; // Đóng modal
        this.loadData(); // Reload lại danh sách
      },
      (err) => {
        console.error('Lỗi khi cập nhật trạng thái:', err);
      }
    );
  } 
}