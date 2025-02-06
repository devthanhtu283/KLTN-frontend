import { ApplicationService } from './../../../services/application.service';
import { UserService } from '../../../services/user.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { CreateUser, User } from 'src/app/models/user.model';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';
import { JobService } from 'src/app/services/job.service';
import { Experience, Job, Location, Worktype } from 'src/app/models/job.model';
import { MapComponent } from '../test/map.component';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Component({
    templateUrl: "./seeker-home.component.html",
    styleUrls: ['./seeker-home.component.css'],

  })
export class SeekerHomeComponent implements OnInit{
  @ViewChild(MapComponent) mapComponent!: MapComponent;

 
  jobs: Job[];
  currentPage: number = 1;
  totalPages: number = 1;
  locations: Location[];
  worktypes: Worktype[];
  experiences: Experience[];
  searchForm: FormGroup;
  isSearching: boolean = false;
  imgBaseUrl: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private changeDetectorRef: ChangeDetectorRef,
    private baseUrl: BaseUrl
  ) {
   
    this.searchForm = this.formBuilder.group({
      title: [''],
      locationId: [''],
      worktypeId: [''],
      experienceId: ['']
    });
  }

  ngOnInit(): void {
    console.log(this.baseUrl.getJobImageUrl());
    this.imgBaseUrl = this.baseUrl.getJobImageUrl();
    console.log(this.imgBaseUrl);
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
        this.totalPages = res.totalPages;
        console.log(this.jobs);
        
      });
    }
  }

  searchJobs(page: number = 1): void {
    this.isSearching = true; 
    const searchParams = this.searchForm.value;

    this.jobService.searchJobs(
      searchParams.title, 
      searchParams.locationId, 
      searchParams.worktypeId, 
      searchParams.experienceId, 
      page, 6 
    ).subscribe(
      (res) => {
        this.jobs = res.content; 
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

  onLocationSelected(event: { lat: number; lng: number }): void {
    console.log('Selected Location:', event);
   
  }
  openMap(): void {
    this.mapComponent.openMap();
  }



  
}