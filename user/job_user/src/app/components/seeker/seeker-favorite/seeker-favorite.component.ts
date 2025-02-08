import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Job } from "src/app/models/job.model";
import { User } from 'src/app/models/user.model';
import { BaseUrl } from "src/app/services/baseUrl.service";
import { JobService } from "src/app/services/job.service";
import { UserService } from "src/app/services/user.service";

@Component({
    templateUrl: "./seeker-favorite.component.html",

  })
export class SeekerFavoriteComponent implements OnInit {
  seekerId: number;
  currentPage: number = 1;
  totalPages: number = 1;
  listJobIds: number[] = [];
  jobs: Job[] = [];
  imgBaseUrl: string;
  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private jobService: JobService,
    private baseUrl: BaseUrl
  ) {}
  user: User;
  ngOnInit(): void {
    this.imgBaseUrl = this.baseUrl.getJobImageUrl();
    const seekerInfo = localStorage.getItem('candidate');
    const seeker = JSON.parse(seekerInfo);
    this.seekerId = seeker.data.id;
    this.loadFavorites(this.currentPage);
  }
  changePage(page: number): void {
    // || page <= this.currentPage
    if (page < 1 || page > this.totalPages ) return; 
    this.currentPage = page;
    this.jobs = [];
    this.loadFavorites(this.currentPage);
  }
  loadFavorites(page: number){
    console.log(page);
    console.log(this.currentPage);
    this.jobService.favoriteFindBySeekerIdPagination(this.seekerId, this.currentPage).then(
      res => {
        this.listJobIds = res.content.map((f) => f.jobId);
        this.totalPages = res.totalPages;
        this.listJobIds.map((j) => {
          this.jobService.findById(j).then(
            r => {
              this.jobs.push(r);
              console.log(this.jobs);
            }
          );
        });
        console.log(this.listJobIds);
        console.log(res);
      }
    );
  }
  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}