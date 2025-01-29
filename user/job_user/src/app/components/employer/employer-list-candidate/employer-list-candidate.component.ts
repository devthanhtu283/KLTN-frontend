import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Application,
  ApplicationUpdateStatus,
} from 'src/app/models/application.model';
import { Job } from 'src/app/models/job.model';
import { User, Employee, Seeker } from 'src/app/models/user.model';
import { ApplicationService } from 'src/app/services/application.service';
import { JobService } from 'src/app/services/job.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  templateUrl: './employer-list-candidate.component.html',
  styleUrls: ['./employer-list-candidate.component.css'],
})
export class EmployerListCandidateComponent implements OnInit {
  applications: Application[];
  totalApplications: number;
  currentPage: number = 0;
  totalPages: number;
  pageSize: number;
  status: number;
  applicationUpdated: ApplicationUpdateStatus;
  totalRejected: number;

  constructor(
    private applicationService: ApplicationService,
    private router: Router,
    private userService: UserService,
    private jobService: JobService,
  ) { }
  user: User;
  employee: Employee;
  seeker: Seeker;
  application: Application;
  job: Job;
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    const employer = JSON.parse(localStorage.getItem('employer'));
    if (!user) {
      this.router.navigate(['/']); // Điều hướng lại nếu không tìm thấy user
    } else {
      this.user = user; // Gán dữ liệu người dùng
      this.employee = employer;
      this.status = 0;
      this.loadData();
    }
  }

  filterByStatus(status: number): void {
    this.status = status;
    this.loadData();
  }

  loadData(): void {
    this.applicationService
      .findByEmployerId(this.user.id, this.currentPage, this.status)
      .then((res) => {
        console.log(res);
        this.applications = res['data']['content'];
        this.totalApplications = res['data']['totalElements'];
        this.totalPages = res['data']['totalPages'];
        this.pageSize = res['data']['size'];
      });
    this.applicationService
      .findByEmployerId(this.user.id, this.currentPage, 3)
      .then((res) => {
        this.totalRejected = res['data']['totalElements'];
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

  // Cập nhật trạng thái hồ sợ
  updateStatus(evt: Event, status: number, applicationId: number): void {
    evt.preventDefault();
    this.applicationUpdated = {
      id: applicationId,
      status: status,
    };
    this.applicationService
      .updateStatus(this.applicationUpdated)
      .then((res) => {
        if (this.applicationUpdated.status == 1) {
          // Đi tìm application trước dựa vào id
          this.applicationService
            .findById(this.applicationUpdated.id)
            .then((res) => {
              this.application = res['data'];
              // Sau đó đi tìm seeker dựa vào application
              if (this.application) {
                this.jobService.findById(this.application.jobId).then(
                  (res) => {
                    this.job = res;
                    if(this.job) {
                      this.userService
                      .findById(this.application.seekerId)
                      .then((res) => {
                        this.user = res['data'];
                        if (this.user) {
                          const emailContent = `
      <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; font-size: 20px; font-weight: bold;">
          Nhà tuyển dụng đã xem hồ sơ của bạn!
        </div>
        <div style="padding: 20px; color: #333;">
          <p>Xin chào <strong>${this.user.username}</strong>,</p>
          <p>Nhà tuyển dụng <strong>${this.employee['data']['companyName']}</strong> đã xem hồ sơ của bạn.</p>
          <p>Hãy kiểm tra thông tin chi tiết về công việc mà bạn đã ứng tuyển:</p>
          <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
            <p><strong>Công việc:</strong> ${this.job.title}</p>
            <p><strong>Vị trí:</strong> ${this.job.address}</p>
            <p><strong>Mức lương:</strong> ${this.job.salary}</p>
          </div>
          <p style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:4200/seeker/job-details/${this.application.jobId}" 
              style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Xem chi tiết công việc
            </a>
          </p>
          <p>Chúc bạn sớm tìm được công việc phù hợp!</p>
          <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
        </div>
        <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
          Đây là email tự động, vui lòng không trả lời.
        </div>
      </div>
    `;
    
    
    
                          const email = {
                            from: 'truongvanhuong221196@gmail.com',
                            to: this.user.email,
                            subject: 'Xác thực tài khoản',
                            content: emailContent,
                          };
                          console.log(this.job.title);
                          this.userService.sendEmail(email).then(
                            (res) => {
                              console.log(res);
                            },
                            (err) => {
                              console.log('Gửi mail không thành công');
                            }
                          );
                        }
                      });
                    }
                  }
                );
       
              }
            });
        }
        if (this.applicationUpdated.status == 2) {
          // Đi tìm application trước dựa vào id
          this.applicationService
            .findById(this.applicationUpdated.id)
            .then((res) => {
              this.application = res['data'];
              // Sau đó đi tìm seeker dựa vào application
              if (this.application) {
                this.jobService.findById(this.application.jobId).then(
                  (res) => {
                    this.job = res;
                    if(this.job) {
                      this.userService
                      .findById(this.application.seekerId)
                      .then((res) => {
                        this.user = res['data'];
                        if (this.user) {
                          const emailContent = `
                          <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                            <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; font-size: 20px; font-weight: bold;">
                              Chúc mừng! Hồ sơ của bạn đã được duyệt!
                            </div>
                            <div style="padding: 20px; color: #333;">
                              <p>Xin chào <strong>${this.user.username}</strong>,</p>
                              <p>Nhà tuyển dụng <strong>${this.employee['data']['companyName']}</strong> đã duyệt hồ sơ của bạn cho vị trí sau:</p>
                              <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 15px 0;">
                                <p><strong>Công việc:</strong> ${this.job.title}</p>
                                <p><strong>Vị trí:</strong> ${this.job.address}</p>
                                <p><strong>Mức lương:</strong> ${this.job.salary || 'Thỏa thuận'}</p>
                              </div>
                              <p>Hãy chờ phản hồi từ nhà tuyển dụng trong thời gian tới!</p>
                              <p style="text-align: center; margin: 20px 0;">
                                <a href="http://localhost:4200/seeker/job-details/${this.application.jobId}" 
                                  style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                  Xem chi tiết công việc
                                </a>
                              </p>
                              <p>Chúc bạn sớm đạt được công việc mong muốn!</p>
                              <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
                            </div>
                            <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
                              Đây là email tự động, vui lòng không trả lời.
                            </div>
                          </div>
                        `;
    
    
    
                          const email = {
                            from: 'truongvanhuong221196@gmail.com',
                            to: this.user.email,
                            subject: 'Xác thực tài khoản',
                            content: emailContent,
                          };
                          console.log(this.job.title);
                          this.userService.sendEmail(email).then(
                            (res) => {
                              console.log(res);
                            },
                            (err) => {
                              console.log('Gửi mail không thành công');
                            }
                          );
                        }
                      });
                    }
                  }
                );
       
              }
            });
        }
        if (this.applicationUpdated.status == 3) {
          // Đi tìm application trước dựa vào id
          this.applicationService
            .findById(this.applicationUpdated.id)
            .then((res) => {
              this.application = res['data'];
              // Sau đó đi tìm seeker dựa vào application
              if (this.application) {
                this.jobService.findById(this.application.jobId).then(
                  (res) => {
                    this.job = res;
                    if(this.job) {
                      this.userService
                      .findById(this.application.seekerId)
                      .then((res) => {
                        this.user = res['data'];
                        if (this.user) {
                          const emailContent = `
                          <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                            <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center; font-size: 20px; font-weight: bold;">
                              Rất tiếc, hồ sơ của bạn chưa phù hợp!
                            </div>
                            <div style="padding: 20px; color: #333;">
                              <p>Xin chào <strong>${this.user.username}</strong>,</p>
                              <p>Chúng tôi rất cảm ơn bạn đã quan tâm đến vị trí <strong>${this.job.title}</strong> tại <strong>${this.employee['data']['companyName']}</strong>.</p>
                              <p>Tuy nhiên, sau khi xem xét hồ sơ của bạn, nhà tuyển dụng nhận thấy rằng **hồ sơ của bạn chưa phù hợp** với yêu cầu của vị trí này.</p>
                              <p>Đừng nản lòng! Hãy tiếp tục khám phá những cơ hội việc làm khác phù hợp với bạn.</p>
                              <p style="text-align: center; margin: 20px 0;">
                                <a href="http://localhost:4200/seeker/list-jobs" 
                                  style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                  Tìm công việc khác
                                </a>
                              </p>
                              <p>Chúc bạn sớm tìm được công việc phù hợp!</p>
                              <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
                            </div>
                            <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
                              Đây là email tự động, vui lòng không trả lời.
                            </div>
                          </div>
                        `;
    
    
    
                          const email = {
                            from: 'truongvanhuong221196@gmail.com',
                            to: this.user.email,
                            subject: 'Xác thực tài khoản',
                            content: emailContent,
                          };
                          console.log(this.job.title);
                          this.userService.sendEmail(email).then(
                            (res) => {
                              console.log(res);
                            },
                            (err) => {
                              console.log('Gửi mail không thành công');
                            }
                          );
                        }
                      });
                    }
                  }
                );
       
              }
            });
        }
        this.loadData();
      });
  }
}
