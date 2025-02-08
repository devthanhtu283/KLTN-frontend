import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { error } from "jquery";
import { MessageService } from "primeng/api";
import { Job } from "src/app/models/job.model";
import { User } from 'src/app/models/user.model';
import { BaseUrl } from "src/app/services/baseUrl.service";
import { JobService } from "src/app/services/job.service";
import { UserService } from "src/app/services/user.service";

@Component({
    templateUrl: "./employer-jobs.component.html",

  })
export class EmployerJobsComponent implements OnInit {
  employerId: number;
  currentPage: number = 1;
  totalPages: number = 1;
  jobs: Job[];
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

}