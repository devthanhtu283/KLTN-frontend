import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Job } from "src/app/models/job.model";
import { User } from 'src/app/models/user.model';
import { ApplicationService } from "src/app/services/application.service";
import { BaseUrl } from "src/app/services/baseUrl.service";
import { JobService } from "src/app/services/job.service";
import { UserService } from "src/app/services/user.service";

@Component({
    templateUrl: "./seeker-job-details.component.html",
    styleUrls: ['./seeker-job-details.component.css'],
})
export class SeekerJobDetailsComponent implements OnInit {
  jobId: any;
  job: Job;
  jobs: Job[] = [];
  user: User;
  result: any;
  applied: boolean = false;
  isApplied: boolean = false;
  appliedOverThreeTimes: boolean = false;
  imgBaseUrl: string;
  constructor(
    private userService: UserService,
    private applicationService: ApplicationService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private jobService: JobService,
    private baseUrl: BaseUrl
  ) {}

  ngOnInit(): void {
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    this.imgBaseUrl = this.baseUrl.getJobImageUrl();
    // Lắng nghe sự thay đổi của param 'id'
    this.route.params.subscribe(params => {
      this.jobId = params['id'];
      console.log('Job ID:', this.jobId);

      // Gọi API để lấy thông tin công việc theo id
      this.loadJobDetails();
    });

    // Lấy danh sách tất cả các công việc
    this.loadAllJobs();
    console.log(this.jobs);
    console.log(this.appliedOverThreeTimes);
    this.applicationService.countApply(this.user.id, this.jobId).then(
      (res) => {
        if(res.data) {
          this.isApplied = true;
        } else if(res.data == 3) {
          this.appliedOverThreeTimes = true;
        } else {
          this.isApplied = false;
        }
      }
    )
  }

  // Hàm tải thông tin công việc chi tiết
  loadJobDetails(): void {
    this.jobService.findById(Number.parseInt(this.jobId)).then(
      res => {
        console.log('Job Details:', res);
        this.job = res;
      },
      err => {
        console.error('Error loading job details:', err);
      }
    );
  }

  // Hàm tải tất cả công việc
  loadAllJobs(): void {
    this.jobService.findAll().then(
      res => {
        console.log('All Jobs:', res);
        this.jobs = res;
      },
      err => {
        console.error('Error loading jobs:', err);
      }
    );
  }

  applyJob(): void {
    var application = {
      jobId: this.jobId,
      seekerId: this.user.id,
      status: 0,
      appliedAt: this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
    }
      this.applicationService.save(application).then(
        (res) => {
          this.result = res.data;
          this.isApplied = true;
          this.applied = true;
          if(this.result == 3) {
            this.appliedOverThreeTimes = true;
            this.messageService.add({severity:'warn', summary: 'Không được ứng tuyển công việc này được', detail: 'Bạn đã ứng tuyển quá 3 lần nên không được phép ứng tuyển nữa !!'});
          } else {
            this.messageService.add({severity:'success', summary: 'Ứng tuyển thành công', detail: 'Bạn đã ứng tuyển thành công công việc này !! Sẽ có phản hồi sớm từ nhà tuyển dụng nhé.'});
            const emailContent = `
              <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; font-size: 20px; font-weight: bold;">
                  Chúc mừng! Bạn đã ứng tuyển thành công!
                </div>
                <div style="padding: 20px; color: #333;">
                  <p>Xin chào <strong>${this.user.username}</strong>,</p>
                  <p>Chúng tôi vui mừng thông báo rằng bạn đã hoàn thành ứng tuyển thành công cho công việc <strong>${this.job.title}</strong>.</p>
                  <p>Dưới đây là thông tin chi tiết về công việc mà bạn đã ứng tuyển:</p>
                  <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 15px 0;">
                    <p><strong>Công việc:</strong> ${this.job.title}</p>
                    <p><strong>Vị trí:</strong> ${this.job.address}</p>
                    <p><strong>Mức lương:</strong> ${this.job.salary}</p>
                  </div>
                  <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất. Để kiểm tra lại thông tin công việc hoặc cập nhật hồ sơ, bạn có thể nhấn vào liên kết dưới đây:</p>
                  <p style="text-align: center; margin: 20px 0;">
                    <a href="http://localhost:4200/seeker/job-details/${this.job.id}" 
                      style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                      Xem chi tiết công việc
                    </a>
                  </p>
                  <p>Chúc bạn may mắn trong quá trình ứng tuyển và hy vọng bạn sẽ có cơ hội hợp tác cùng công ty!</p>
                  <p>Trân trọng,<br>Đội ngũ tuyển dụng</p>
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
            this.userService.sendEmail(email).then(
              (res) => {
                console.log(res);
              }
            )
          }
        },
        (err) => {
          console.log("Error: ", err);
        }
      )
  }
}
