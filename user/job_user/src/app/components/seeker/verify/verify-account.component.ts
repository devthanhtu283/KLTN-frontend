import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
    templateUrl: './verify-account.component.html',
})
export class VerifyAccountComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Lấy email và securityCode từ URL
        this.route.queryParams.subscribe(params => {
            const email = params['email'];
            const securityCode = params['securityCode'];
            const user = JSON.parse(localStorage.getItem('user'));
            // Kiểm tra nếu có đủ email và securityCode
            if (email && securityCode) {
                // Gọi API để xác thực tài khoản
                this.userService.verifyAccount(email, securityCode).then(response => {
                    console.log('API Response:', response);
                    if (response && response.status) {
                        this.messageService.add({severity:'success', summary:'Xác thực thành công', detail:'Tài khoản của bạn đã được xác thực thành công!'});
                        if(user.user_type === 1) {
                            this.router.navigate(['/candidate-dashboard']); // Chuyển hướng về trang chủ hoặc trang đăng nhập
                        } else {
                            this.router.navigate(['/employer-dashboard']);
                        }
                    } else if(user.user_type === 2) {
                        this.messageService.add({severity:'error', summary:'Xác thực thất bại', detail:'Mã xác thực không hợp lệ hoặc tài khoản đã xác thực.'});
                    }
                }).catch(error => {
                    console.error("API Error:", error);
                    this.messageService.add({severity:'error', summary:'Lỗi', detail:'Có lỗi xảy ra khi xác thực tài khoản.'});
                });
            } else {
                console.error("Thiếu email hoặc securityCode trong URL");
            }
        });
    }
}
