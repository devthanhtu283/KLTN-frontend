import { UserService } from './../../services/user.service';
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
import { CreateUser, User } from 'src/app/models/user.model';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';

@Component({
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css'],

  })
export class HomeComponent implements OnInit{
  currentForm: string = 'candidate'; // Ban đầu hiển thị form candidate
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private datePipe: DatePipe
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
  }

  ngOnInit(): void {
    this.showForm(this.currentForm);
    
  }

  showForm(form: string) {
    this.currentForm = form; // Cập nhật form hiện tại
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
      user_type: 1,
      created: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      securityCode: this.randomNumber.toString(),
      status: false
    };

    this.userService.register(this.newCandidate).then(
       res => {
        var result = res as boolean;
        this.messageService.add({severity:'success',summary:'Gửi xác nhận về mail',detail:'Bạn đã tạo tài khoản thành công. Sẽ có 1 email để bạn xác thực tài khoản.'}); 
        if(res) {
          this.userService.findByEmail(this.newCandidate.email).then((response : any)=> {
            this.candidate = response.user;
            console.log(this.candidate);
            if(this.candidate) {
              localStorage.setItem('user', JSON.stringify(this.candidate));
              localStorage.setItem('candidate', JSON.stringify(this.userService.findByIdSeeker(this.candidate.id)));
              // Gửi email để verify tài khoản 
              const emailContent = `
                <p>Chào bạn,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>
                <a href='http://localhost:4200/verify-account?email=${encodeURIComponent(this.candidate.email)}&securityCode=${this.candidate.securityCode}'>Xác nhận tài khoản</a>
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
      user_type: 2,
      created: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      securityCode: this.randomNumber.toString(),
      status: false
    };

    this.userService.register(this.newEmployer).then(
       res => {
        var result = res as boolean;
        this.messageService.add({severity:'success',summary:'Gửi xác nhận về mail',detail:'Bạn đã tạo tài khoản thành công. Sẽ có 1 email để bạn xác thực tài khoản.'}); 
        if(res) {
          this.userService.findByEmail(this.newEmployer.email).then((response : any)=> {
            this.employer = response.user;
            if(this.employer) {
              localStorage.setItem('user', JSON.stringify(this.employer));
              localStorage.setItem('employer', JSON.stringify(this.userService.findByIdEmployer(this.employer.id)));
              // Gửi email để verify tài khoản 
              const emailContent = `
                <p>Chào bạn,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>
                <a href='http://localhost:4200/verify-account?email=${encodeURIComponent(this.employer.email)}&securityCode=${this.employer.securityCode}'>Xác nhận tài khoản</a>
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
        this.messageService.add({
          severity: "success",
          summary: "Đăng nhập thành công",
          detail: "Bạn đã đăng nhập vào hệ thống thành công."
        });
  
        localStorage.setItem('user', JSON.stringify(userInfo['user']));
  
        if (userInfo['user'].user_type === 1) {
          const candidateInfo = await this.userService.findByIdSeeker(userInfo['user'].id);
          localStorage.setItem('candidate', JSON.stringify(candidateInfo));
          window.location.href = '/candidate-dashboard';
        } else if (userInfo['user'].user_type === 2) {
          const employerInfo = await this.userService.findByIdEmployer(userInfo['user'].id);
          localStorage.setItem('employer', JSON.stringify(employerInfo));
          window.location.href = '/employer-dashboard';
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