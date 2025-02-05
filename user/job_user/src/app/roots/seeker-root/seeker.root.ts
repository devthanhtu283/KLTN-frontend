import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CreateUser, User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chatBot.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'seeker-root',
  templateUrl: './seeker.root.html',
})
export class SeekerRoot implements OnInit {
  chatMessages: { text: string; isUser: boolean }[] = []; // Mảng lưu trữ tin nhắn
  chatInput: string = ''; // Biến lưu trữ tin nhắn nhập từ người dùng
  isTyping: boolean = false; // Biến kiểm soát trạng thái "Đang nhập..."
  title = 'job_user';
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
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private chatService: ChatService // Thêm ChatService vào constructor
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
    // Lấy user từ localStorage và gán vào biến `user`
    this.showForm(this.currentForm);
    this.login();
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    this.chatMessages.push({
      text: 'Xin chào, đây là AI Chatbot thông minh, xin hãy nhập câu hỏi',
      isUser: false,
    });
  }

  async clearData(): Promise<void> {
    localStorage.removeItem('user');
    localStorage.removeItem('candidate');
    localStorage.removeItem('employer');
    this.user = null;
    this.cdr.detectChanges();
    await this.router.navigate(['/']);
  }

  // Hàm gửi tin nhắn
  async sendMessage(): Promise<void> {
    // Kiểm tra nếu chatInput trống hoặc chỉ chứa khoảng trắng
    if (!this.chatInput || this.chatInput.trim() === '') {
      console.error('Tin nhắn không được để trống');
      return; // Dừng hàm nếu tin nhắn trống
    }

    // Thêm tin nhắn của người dùng vào mảng chatMessages
    this.chatMessages.push({ text: this.chatInput, isUser: true });
    var chatInput1 = this.chatInput;
    this.chatInput = '';

    // Xóa nội dung trong ô nhập tin nhắn

    // Hiển thị trạng thái "Đang nhập..."
    this.isTyping = true;

    try {
      // Gửi tin nhắn đến API và nhận phản hồi
      const response = await this.chatService
        .sendMessage(chatInput1, 'acc1')
        .toPromise();
      this.chatMessages.push({ text: response.message, isUser: false }); // Thêm phản hồi từ bot
    } catch (error) {
      console.error('Error sending message:', error);
      this.chatMessages.push({
        text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
        isUser: false,
      });
    } finally {
      // Ẩn trạng thái "Đang nhập..." sau khi nhận được phản hồi hoặc có lỗi
      this.isTyping = false;
    }
  }
  // Hàm xử lý sự kiện nhấn phím Enter
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
  // Hàm đăng kí cho ứng viên
  registerCandidate() {
    // Nếu xác nhận mật khẩu không khớp sẽ đăng kí thất bại
    if (
      this.registerCandidateForm.value.candidatePassword !==
      this.registerCandidateForm.value.candidateConfirmPassword
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Xác nhận lại mật khẩu',
        detail:
          'Mật khẩu xác nhận không trùng với mật khẩu bạn tạo. Vui lòng nhập lại',
      });
      return; // Ngăn không cho tiếp tục nếu mật khẩu không khớp
    }

    // Điền đầy đủ thông tin
    if (!this.registerCandidateForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Đăng kí thất bại',
        detail: 'Vui lòng điền đầy đủ thông tin.',
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
      status: 0,
    };

    this.userService.register(this.newCandidate).then(
      (res) => {
        var result = res as boolean;
        this.messageService.add({
          severity: 'success',
          summary: 'Gửi xác nhận về mail',
          detail:
            'Bạn đã tạo tài khoản thành công. Sẽ có 1 email để bạn xác thực tài khoản.',
        });
        if (res) {
          this.userService
            .findByEmail(this.newCandidate.email)
            .then((response: any) => {
              this.candidate = response['data'];
              if (this.candidate) {
                localStorage.setItem('user', JSON.stringify(this.candidate));
                localStorage.setItem(
                  'candidate',
                  JSON.stringify(
                    this.userService.findByIdSeeker(this.candidate.id)
                  )
                );
                // Gửi email để verify tài khoản
                const emailContent = `
                <p>Chào bạn,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>
                <a href='http://localhost:4200/seeker/verify-account?email=${encodeURIComponent(
                  this.candidate.email
                )}&securityCode=${
                  this.candidate.securityCode
                }'>Xác nhận tài khoản</a>
              `;
                const email = {
                  from: 'truongvanhuong221196@gmail.com',
                  to: this.candidate.email,
                  subject: 'Xác thực tài khoản',
                  content: emailContent,
                };
                console.log(email);
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
        console.log(res);
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Thất bại',
          detail: 'Đăng kí thất bại',
        });
      }
    );
  }

  // Hàm đăng kí cho nhà tuyển dụng
  registerEmployer() {
    // Nếu xác nhận mật khẩu không khớp sẽ đăng kí thất bại
    if (
      this.registerEmployerForm.value.candidatePassword !==
      this.registerEmployerForm.value.candidateConfirmPassword
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Xác nhận lại mật khẩu',
        detail:
          'Mật khẩu xác nhận không trùng với mật khẩu bạn tạo. Vui lòng nhập lại',
      });
      return; // Ngăn không cho tiếp tục nếu mật khẩu không khớp
    }

    // Điền đầy đủ thông tin
    if (!this.registerEmployerForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Đăng kí thất bại',
        detail: 'Vui lòng điền đầy đủ thông tin.',
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
      status: 0,
    };

    this.userService.register(this.newEmployer).then(
      (res) => {
        var result = res as boolean;
        this.messageService.add({
          severity: 'success',
          summary: 'Gửi xác nhận về mail',
          detail:
            'Bạn đã tạo tài khoản thành công. Sẽ có 1 email để bạn xác thực tài khoản.',
        });
        if (res) {
          this.userService
            .findByEmail(this.newEmployer.email)
            .then((response: any) => {
              console.log(response['data']);
              this.employer = response['data'];
              if (this.employer) {
                localStorage.setItem('user', JSON.stringify(this.employer));
                localStorage.setItem(
                  'employer',
                  JSON.stringify(
                    this.userService.findByIdEmployer(this.employer.id)
                  )
                );
                // Gửi email để verify tài khoản
                const emailContent = `
                <p>Chào bạn,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>
                <a href='http://localhost:4200/employer/verify-account?email=${encodeURIComponent(
                  this.employer.email
                )}&securityCode=${
                  this.employer.securityCode
                }'>Xác nhận tài khoản</a>
              `;
                const email = {
                  from: 'truongvanhuong221196@gmail.com',
                  to: this.employer.email,
                  subject: 'Xác thực tài khoản',
                  content: emailContent,
                };
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
        console.log(res);
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Thất bại',
          detail: 'Đăng kí thất bại',
        });
      }
    );
  }

  // Hàm đăng nhập
  async login() {
    if (!this.loginForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Đăng nhập thất bại',
        detail: 'Vui lòng điền đầy đủ thông tin.',
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
        const userInfo = await this.userService.findByEmail(
          this.loginForm.value.email
        );
        console.log(userInfo['data']);
        this.messageService.add({
          severity: 'success',
          summary: 'Đăng nhập thành công',
          detail: 'Bạn đã đăng nhập vào hệ thống thành công.',
        });

        localStorage.setItem('user', JSON.stringify(userInfo['data']));

        if (userInfo['data'].userType === 1) {
          const candidateInfo = await this.userService.findByIdSeeker(
            userInfo['data'].id
          );
          localStorage.setItem('candidate', JSON.stringify(candidateInfo));
          setTimeout(() => {
            window.location.href = '/seeker/home';
          }, 1000);
        
        } else if (userInfo['data'].userType === 2) {
          const employerInfo = await this.userService.findByIdEmployer(
            userInfo['data'].id
          );
          localStorage.setItem('employer', JSON.stringify(employerInfo));
          setTimeout(() => {
            window.location.href = '/employer/dashboard';
          }, 1000);
          
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Đăng nhập thất bại',
          detail: 'Thông tin đăng nhập không chính xác.',
        });
      }
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi kết nối',
        detail: 'Đã xảy ra lỗi khi kết nối tới máy chủ. Vui lòng thử lại sau.',
      });
    }
  }
  showForm(form: string) {
    this.currentForm = form;
  }
}
