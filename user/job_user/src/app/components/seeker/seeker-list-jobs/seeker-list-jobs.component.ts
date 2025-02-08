import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Experience, Location, Worktype } from 'src/app/models/job.model';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  templateUrl: './seeker-list-jobs.component.html',
})
export class SeekerListJobsComponent implements OnInit {
  jobs = [];
  currentPage: number = 1;
  totalPages: number = 1;
  isSearching: boolean = false;
  totalJobs: number;
  locations: Location[];
  worktypes: Worktype[];
  experiences: Experience[];
  searchForm: FormGroup;
  seekerId: number;
  imgBaseUrl: string;
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private jobService: JobService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private messageService: MessageService,
    private baseUrl: BaseUrl
  ) {}

  ngOnInit(): void {
    this.imgBaseUrl = this.baseUrl.getJobImageUrl();
    const seekerInfo = localStorage.getItem('candidate');
    if(seekerInfo != null){
      const seeker = JSON.parse(seekerInfo);
      this.seekerId = seeker.data.id;
    }
  
    this.searchForm = this.fb.group({
      title: [''],
      locationId: [''],
      worktypeId: [''],
      experienceId: ['']
    });

    this.loadJobs(this.currentPage);
   
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
  }

  loadJobs(page: number){
    if (this.isSearching) {
      this.searchJobs(page);
    } else {
      this.jobService.findAllPagination(page).subscribe(res => {
        this.jobs = res.content;
        console.log(this.jobs);
        this.totalPages = res.totalPages;
        this.totalJobs = res.totalElements;
       
        res.content.map((j) => {
          console.log(j.id);
          if(this.seekerId == null){
              j.chekFavorite == false;
          } else {
            this.jobService.favoriteCheckExists(j.id, this.seekerId).then(
              res => {
                j.checkFavorite = res.status;
                console.log(res);
  
              }
            );
          }
         
        });
      });
    }
  }

  searchJobs(page: number = 1): void {
    this.isSearching = true;
    const searchParams = this.searchForm.value;
  
    // Kiểm tra nếu không có giá trị nào được chọn trong form
    if (!searchParams.title && !searchParams.locationId && !searchParams.worktypeId && !searchParams.experienceId) {
      // Nếu không có giá trị nào, gọi loadJobs để lấy danh sách công việc mặc định
      this.isSearching = false; // Đảm bảo trạng thái tìm kiếm được đặt lại
      this.loadJobs(page); // Tải lại tất cả công việc mà không áp dụng tìm kiếm
      return;
    }
  
    // Nếu có giá trị tìm kiếm, thực hiện tìm kiếm
    this.jobService.searchJobs(
      searchParams.title, 
      searchParams.locationId, 
      searchParams.worktypeId, 
      searchParams.experienceId, 
      page, 6
    ).subscribe(
      (res) => {
        this.jobs = res.content; 
        res.content.map((j) => {
          console.log(j.id);
          this.jobService.favoriteCheckExists(j.id, this.seekerId).then(
            res => {
              j.checkFavorite = res.status;
              console.log(res);

            }
          );
        });
        this.totalPages = res.totalPages; 
        this.currentPage = page; 
        console.log('Found Jobs:', this.jobs);
      },
      (error) => console.error('Search Error:', error)
    );
  }
  

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return; 
    this.currentPage = page;
    this.loadJobs(this.currentPage);
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getJobRange(): string {
    // Kiểm tra nếu có kết quả tìm kiếm, nếu không thì lấy số công việc từ phân trang bình thường
    const jobCount = this.isSearching ? this.jobs.length : this.totalJobs;
    const start = (this.currentPage - 1) * 6 + 1; // Tính chỉ số bắt đầu (ví dụ: 1, 7, 13...)
    const end = Math.min(this.currentPage * 6, jobCount); // Tính chỉ số kết thúc (ví dụ: 6, 12, 18...)
  
    return `Showing ${start}-${end} of ${jobCount} results`;
  }

  addFavorite(jobId: number) {
    
    const seekerInfo = localStorage.getItem('candidate');
    console.log(seekerInfo);
    if (seekerInfo) {
      var favorite = {
        seekerId: this.seekerId,
        jobId: jobId
      }
      this.jobService.favoriteCreate(favorite).then(
        res => {
          console.log(res.status);
          if(res.status){
            this.loadJobs(this.currentPage);
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Lưu việc thành công',
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Đã tồn tại',
              detail: 'Việc đã được lưu rồi, vui lòng xem trong danh sách yêu thích',
            });
          }
        }
      );
     
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Lưu việc thất bại',
        detail: 'Vui lòng đăng nhập để lưu việc',
      });
    }
  }
  

}