import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { error } from "jquery";
import { MessageService } from "primeng/api";
import { Application } from "src/app/models/application.model";
import { Job } from "src/app/models/job.model";
import { User } from 'src/app/models/user.model';
import { ApplicationService } from "src/app/services/application.service";
import { BaseUrl } from "src/app/services/baseUrl.service";
import { JobService } from "src/app/services/job.service";
import { UserService } from "src/app/services/user.service";

@Component({
    templateUrl: "./employer-jobs.component.html",
    styleUrls: ['./employer-jobs.component.css'],
  })
export class EmployerJobsComponent implements OnInit {
  employerId: number;
  currentPage: number = 1;
  totalPages: number = 1;
  totalApplications: number;
  currentApplicationPage: number = 0;
  totalApplicationPages: number;
  pageApplicationSize: number;
  jobs: Job[];
  applications: Application[];
  showModal: boolean = false;
  imgBaseUrl: string;
  visible: boolean = false;
  formData: any = {}; // Dữ liệu form
    // Dữ liệu mẫu cho các dropdown
    locations = [];
  
    experiences = [];
  
    worktypes = [];
  constructor(
    private userService: UserService,
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private baseUrl: BaseUrl,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService
  ) {}
  user: User;
  ngOnInit(): void {
    this.jobService.locationFindAll().then(
      res => {
        this.locations = res.filter((location: any) => location.status === true);
        console.log(this.locations);
        this.changeDetectorRef.detectChanges(); 

      }
    );
    this.jobService.worktypeFindAll().then(
      res => {
        this.worktypes = res.filter((worktype: any) => worktype.status === true);
        console.log(this.worktypes);
        this.changeDetectorRef.detectChanges(); 
      }
    );
    this.jobService.experienceFindAll().then(
      res => {
        this.experiences = res.filter((experience: any) => experience.status === true);
        this.changeDetectorRef.detectChanges(); 
      }
    );
    this.imgBaseUrl = this.baseUrl.getJobImageUrl();
    var employerData = localStorage.getItem('employer');
    console.log(employerData);
    var employer = JSON.parse(employerData);
    if(employer != null){
      this.employerId = employer.data.id;
    }
    this.loadJobs(this.currentPage);
    console.log(employer);
  }
  loadJobs(currentPage: number){
    this.jobService.findByEmployerIdPagination(this.employerId, this.currentPage).then(
      res => {
        this.jobs = res.content;
        console.log(res);
        this.totalPages = res.totalPages;
      }
    );
  }

  changePage(page: number): void {
    // || page <= this.currentPage
    if (page < 1) return; 
    this.currentPage = page;
    this.jobs = [];
    this.loadJobs(this.currentPage);
  }
  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  addJob() {
    this.visible = true;
  }



  onSave() {
    
    console.log('Dữ liệu đã lưu:', this.formData);
    var job = {
      employerId: this.employerId,
      title: this.formData.title,
      description: this.formData.description,
      required: this.formData.required,
      address: this.formData.address,
      locationId: this.formData.location_id.id,
      salary: this.formData.salary,
      postedExpired: this.formData.posted_expired,
      experienceId: this.formData.experience_id.id,
      requiredSkills: this.formData.required_skills,
      member: this.formData.member,
      worktypeId: this.formData.work_type_id.id
    }
    console.log(job);
    this.jobService.create(job).then(
      res => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Thêm việc thành công',
        });
        this.loadJobs(this.currentPage);
      },
      error => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Thêm không thành công',
        });
      }
    );
    
    this.visible = false; // Đóng dialog sau khi lưu
  }
  stopJob(jobId: number){
    this.jobService.delete(jobId).then(
      res => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Ngưng tuyển dụng thành công',
        });
        this.loadJobs(this.currentPage);
      },
      error => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thành công',
        });
      }
    );
  }

  showApplicants(jobId: number){
    console.log(jobId);
    console.log(this.currentPage);
    this.applicationService.listApplication(jobId, this.currentApplicationPage, 0).then(
      (res) => {
        this.applications = res['data']['content'];
        this.totalApplications = res['data']['totalElements'];
        this.totalApplicationPages = res['data']['totalPages'];
        this.pageApplicationSize = res['data']['size'];
        this.showModal = true;
      }
    )
  }

  closeModal() {
    this.showModal = false;
  }
  viewProfile(applicant: any) {
    window.open(`/seeker/profile/${applicant.seekerId}`, "_blank");
  }

  approveApplicant(application: Application): void {
    const applicationUpdate = {
      id: application.id,
      status: 2, // Trạng thái "Đã duyệt"
    };
  
    this.applicationService.updateStatus(applicationUpdate).then(
      (res) => {
        // Cập nhật trạng thái trong danh sách ứng viên
        application.status = 2;
        this.applicationService.updateStatus(applicationUpdate).then(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Ứng viên đã được duyệt',
            });
            this.showApplicants(application.jobId); 
          },
          (err) => {
            console.error('Lỗi khi duyệt ứng viên:', err);
          }
        );
        // Gửi email thông báo cho ứng viên
        this.userService.findById(application.seekerId).then((userRes) => {
          const user = userRes['data'];
          const emailContent = `
            <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; font-size: 20px; font-weight: bold;">
                Chúc mừng! Hồ sơ của bạn đã được duyệt!
              </div>
              <div style="padding: 20px; color: #333;">
                <p>Xin chào <strong>${user.username}</strong>,</p>
                <p>Nhà tuyển dụng đã duyệt hồ sơ của bạn cho vị trí <strong>${application.jobTitle}</strong>.</p>
                <p>Hãy chờ phản hồi từ nhà tuyển dụng trong thời gian tới!</p>
                <p style="text-align: center; margin: 20px 0;">
                  <a href="http://localhost:4200/seeker/job-details/${application.jobId}" 
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
            from: 'your-email@example.com',
            to: user.email,
            subject: 'Hồ sơ của bạn đã được duyệt!',
            content: emailContent,
          };
  
          this.userService.sendEmail(email).then(
            () => console.log('Email đã được gửi thành công'),
            () => console.error('Gửi email thất bại')
          );
        });
      },
      (err) => {
        console.error('Cập nhật trạng thái thất bại:', err);
      }
    );
  }
  
  rejectApplicant(application: Application): void {
    const applicationUpdate = {
      id: application.id,
      status: 3, // Trạng thái "Đã từ chối"
    };
  
    this.applicationService.updateStatus(applicationUpdate).then(
      (res) => {
        // Cập nhật trạng thái trong danh sách ứng viên
        application.status = 3;
        this.applicationService.updateStatus(applicationUpdate).then(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Hồ sơ đã bị từ chối',
            });
            this.showApplicants(application.jobId); 
          },
          (err) => {
            console.error('Lỗi khi từ chối ứng viên:', err);
          }
        );
  
        // Gửi email thông báo cho ứng viên
        this.userService.findById(application.seekerId).then((userRes) => {
          const user = userRes['data'];
          const emailContent = `
            <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center; font-size: 20px; font-weight: bold;">
                Rất tiếc, hồ sơ của bạn chưa phù hợp!
              </div>
              <div style="padding: 20px; color: #333;">
                <p>Xin chào <strong>${user.username}</strong>,</p>
                <p>Chúng tôi rất cảm ơn bạn đã quan tâm đến vị trí <strong>${application.jobTitle}</strong>.</p>
                <p>Tuy nhiên, sau khi xem xét hồ sơ của bạn, nhà tuyển dụng nhận thấy rằng hồ sơ của bạn chưa phù hợp với yêu cầu của vị trí này.</p>
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
            from: 'your-email@example.com',
            to: user.email,
            subject: 'Hồ sơ của bạn chưa phù hợp',
            content: emailContent,
          };
  
          this.userService.sendEmail(email).then(
            () => console.log('Email đã được gửi thành công'),
            () => console.error('Gửi email thất bại')
          );
        });
      },
      (err) => {
        console.error('Cập nhật trạng thái thất bại:', err);
      }
    );
  }
}