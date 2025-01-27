import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Job } from "src/app/models/job.model";
import { User } from 'src/app/models/user.model';
import { JobService } from "src/app/services/job.service";
import { UserService } from "src/app/services/user.service";

@Component({
    templateUrl: "./seeker-job-details.component.html",
})
export class SeekerJobDetailsComponent implements OnInit {
  jobId: any;
  job: Job;
  jobs: Job[] = [];
  user: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    // Lắng nghe sự thay đổi của param 'id'
    this.route.params.subscribe(params => {
      this.jobId = params['id'];
      console.log('Job ID:', this.jobId);

      // Gọi API để lấy thông tin công việc theo id
      this.loadJobDetails();
    });

    // Lấy danh sách tất cả các công việc
    this.loadAllJobs();
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
}
