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

@Component({
    templateUrl: "./seeker-home.component.html",
    styleUrls: ['./seeker-home.component.css'],

  })
export class SeekerHomeComponent implements OnInit{
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  currentForm: string = 'candidate'; 
  registerCandidateForm: FormGroup;
  registerEmployerForm: FormGroup;
  checkEmailForm: FormGroup;
  loginForm: FormGroup;
  newCandidate: CreateUser;
  candidate: User;
  newEmployer: CreateUser;
  employer: User;
  user: User;
  randomNumber = Math.floor(100000 + Math.random() * 900000);
  showForgotModal = true;
  showResetPasswordModal = false;
  jobs: Job[];
  currentPage: number = 1;
  totalPages: number = 1;
  locations: Location[];
  worktypes: Worktype[];
  experiences: Experience[];
  searchForm: FormGroup;
  isSearching: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private jobService: JobService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.registerCandidateForm = this.formBuilder.group({
      candidateName: ['', [Validators.required]],
      candidateEmail: ['', [Validators.required, Validators.email]],
      candidatePassword: ['', [Validators.required]],
      candidateConfirmPassword: ['', [Validators.required]]
    });
    this.registerEmployerForm = this.formBuilder.group({
      employerName: ['', [Validators.required]],
      employerEmail: ['', [Validators.required, Validators.email]],
      employerPassword: ['', [Validators.required]],
      employerConfirmPassword: ['', [Validators.required]]
    });
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.checkEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.searchForm = this.formBuilder.group({
      title: [''],
      locationId: [''],
      worktypeId: [''],
      experienceId: ['']
    });
  }

  ngOnInit(): void {
    this.showForm(this.currentForm);
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
  showForm(form: string) {
    this.currentForm = form; 
  }
  onLocationSelected(event: { lat: number; lng: number }): void {
    console.log('Selected Location:', event);
   
  }
  openMap(): void {
    this.mapComponent.openMap();
  }

  // Hàm đăng kí cho ứng viên 
  registerCandidate() {
    // Nếu xác nhận mật khẩu không khớp sẽ đăng kí thất bại
    if (this.registerCandidateForm.value.candidatePassword !== this.registerCandidateForm.value.candidateConfirmPassword) {
      this.messageService.add({
        severity: "error",
        summary: "Xác nhận lại mật khẩu",
        detail: "Mật khẩu xác nhận không trùng với mật khẩu bạn tạo. Vui lòng nhập lại"
      });
      return; // Ngăn không cho tiếp tục nếu mật khẩu không khớp
    }

    // Điền đầy đủ thông tin
    if(!this.registerCandidateForm.valid) {
      this.messageService.add({
        severity: "error",
        summary: "Đăng kí thất bại",
        detail: "Vui lòng điền đầy đủ thông tin."
      });
      return; // Ngăn không cho tiếp tục nếu mật khẩu không khớp
    }

    this.newCandidate = {
      username: this.registerCandidateForm.value.candidateName,
      email: this.registerCandidateForm.value.candidateEmail,
      password: this.registerCandidateForm.value.candidatePassword,
      userType: 1,
      created: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      securityCode: this.randomNumber.toString(),
      status: 0
    };

    this.userService.register(this.newCandidate).then(
       res => {
        var result = res as boolean;
        this.messageService.add({severity:'success',summary:'Gửi xác nhận về mail',detail:'Bạn đã tạo tài khoản thành công. Sẽ có 1 email để bạn xác thực tài khoản.'}); 
        if(res) {
          this.userService.findByEmail(this.newCandidate.email).then((response : any)=> {
            this.candidate = response['data'];
            if(this.candidate) {
              localStorage.setItem('user', JSON.stringify(this.candidate));
              localStorage.setItem('candidate', JSON.stringify(this.userService.findByIdSeeker(this.candidate.id)));
              // Gửi email để verify tài khoản 
              const emailContent = `
                <p>Chào bạn,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>
                <a href='http://localhost:4200/seeker/verify-account?email=${encodeURIComponent(this.candidate.email)}&securityCode=${this.candidate.securityCode}'>Xác nhận tài khoản</a>
              `;
              const email = {
                from: 'truongvanhuong221196@gmail.com',
                to: this.candidate.email,
                subject: 'Xác thực tài khoản',
                content: emailContent
              };
              console.log(email);
              this.userService.sendEmail(email).then(
                (res) => {
                  console.log(res);
                },
                (err) => {
                  console.log("Gửi mail không thành công");
                }
              );
            }
          });
        }
        console.log(res);
       },
       (err) => {
        this.messageService.add({severity:'error',summary:'Thất bại',detail:'Đăng kí thất bại'}); 
       }
    )

  }

  // Hàm đăng kí cho nhà tuyển dụng
  registerEmployer() {
    // Nếu xác nhận mật khẩu không khớp sẽ đăng kí thất bại
    if (this.registerEmployerForm.value.candidatePassword !== this.registerEmployerForm.value.candidateConfirmPassword) {
      this.messageService.add({
        severity: "error",
        summary: "Xác nhận lại mật khẩu",
        detail: "Mật khẩu xác nhận không trùng với mật khẩu bạn tạo. Vui lòng nhập lại"
      });
      return; // Ngăn không cho tiếp tục nếu mật khẩu không khớp
    }

    // Điền đầy đủ thông tin
    if(!this.registerEmployerForm.valid) {
      this.messageService.add({
        severity: "error",
        summary: "Đăng kí thất bại",
        detail: "Vui lòng điền đầy đủ thông tin."
      });
      return; // Ngăn không cho tiếp tục nếu mật khẩu không khớp
    }

    this.newEmployer = {
      username: this.registerEmployerForm.value.employerName,
      email: this.registerEmployerForm.value.employerEmail,
      password: this.registerEmployerForm.value.employerPassword,
      userType: 2,
      created: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      securityCode: this.randomNumber.toString(),
      status: 0
    };

    this.userService.register(this.newEmployer).then(
       res => {
        var result = res as boolean;
        this.messageService.add({severity:'success',summary:'Gửi xác nhận về mail',detail:'Bạn đã tạo tài khoản thành công. Sẽ có 1 email để bạn xác thực tài khoản.'}); 
        if(res) {
          this.userService.findByEmail(this.newEmployer.email).then((response : any)=> {
            console.log(response['data']);
            this.employer = response['data'];
            if(this.employer) {
              localStorage.setItem('user', JSON.stringify(this.employer));
              localStorage.setItem('employer', JSON.stringify(this.userService.findByIdEmployer(this.employer.id)));
              // Gửi email để verify tài khoản 
              const emailContent = `
                <p>Chào bạn,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>
                <a href='http://localhost:4200/employer/verify-account?email=${encodeURIComponent(this.employer.email)}&securityCode=${this.employer.securityCode}'>Xác nhận tài khoản</a>
              `;
              const email = {
                from: 'truongvanhuong221196@gmail.com',
                to: this.employer.email,
                subject: 'Xác thực tài khoản',
                content: emailContent
              };
              this.userService.sendEmail(email).then(
                (res) => {
                  console.log(res);
                },
                (err) => {
                  console.log("Gửi mail không thành công");
                }
              );
            }
          });
        }
        console.log(res);
       },
       err => {
        this.messageService.add({severity:'error',summary:'Thất bại',detail:'Đăng kí thất bại'}); 
       }
    )

  }

  // Hàm đăng nhập
  async login() {
    if (!this.loginForm.valid) {
      this.messageService.add({
        severity: "error",
        summary: "Đăng nhập thất bại",
        detail: "Vui lòng điền đầy đủ thông tin."
      });
      return;
    }
  
    const user = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
  
    try {
      const loginResponse = await this.userService.login(user);
      if (loginResponse.status === true) {
        const userInfo = await this.userService.findByEmail(this.loginForm.value.email);
        console.log(userInfo['data']);
        this.messageService.add({
          severity: "success",
          summary: "Đăng nhập thành công",
          detail: "Bạn đã đăng nhập vào hệ thống thành công."
        });
  
        localStorage.setItem('user', JSON.stringify(userInfo['data']));
  
        if (userInfo['data'].userType === 1) {
          const candidateInfo = await this.userService.findByIdSeeker(userInfo['data'].id);
          localStorage.setItem('candidate', JSON.stringify(candidateInfo));
          window.location.href = '/seeker/home';
        } else if (userInfo['data'].userType === 2) {
          const employerInfo = await this.userService.findByIdEmployer(userInfo['data'].id);
          localStorage.setItem('employer', JSON.stringify(employerInfo));
          window.location.href = '/employer/dashboard';
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Đăng nhập thất bại',
          detail: 'Thông tin đăng nhập không chính xác.'
        });
      }
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi kết nối',
        detail: 'Đã xảy ra lỗi khi kết nối tới máy chủ. Vui lòng thử lại sau.'
      });
    }
  }


  
}