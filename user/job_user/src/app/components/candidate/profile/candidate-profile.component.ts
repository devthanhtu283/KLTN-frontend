import { DatePipe, ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Seeker, User } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";

@Component({
    templateUrl: "./candidate-profile.component.html",
})
export class CandidateProfilePasswordComponent implements OnInit {

    candidateForm: FormGroup;
    user: User;
    seeker: Seeker;
    fullName: string;
    phone: string;
    address: string;
    gender: string;
    avatar: string;
    avatarUrl: string = 'assets/img/dashboard/profile.svg';

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private viewportScroller: ViewportScroller,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const fragment = this.route.snapshot.fragment;
                if (fragment) {
                    this.viewportScroller.scrollToAnchor(fragment);
                }
            }
        });

        const user = JSON.parse(localStorage.getItem('user'));
        const candidate = JSON.parse(localStorage.getItem('candidate'));

        if (!user) {
            this.router.navigate(['/']); // Điều hướng lại nếu không tìm thấy user
        } else {
            this.user = user; // Gán dữ liệu người dùng
            // Khởi tạo form với dữ liệu từ candidate nếu có
            this.candidateForm = this.formBuilder.group({
                fullName: [candidate?.fullName || ''],
                phone: [candidate?.phone || '', [Validators.pattern('^\\+?\\d{10,15}$')]],
                address: [candidate?.address || ''],
                gender: [candidate?.gender || ''],
                avatar: [''],
                dob: [candidate?.dob || '']
            });
        }

         // Lấy thông tin từ localStorage nếu có
         if (candidate) {
            this.candidateForm.patchValue(candidate);
            const formattedDob = this.convertDateFormat(candidate.dob); // Chuyển đổi định dạng
            this.candidateForm.patchValue({ dob: formattedDob });
            this.avatarUrl = candidate.avatar || 'assets/img/dashboard/profile.svg';
         }
    }

    // Hàm submit để cập nhật thông tin
    onSubmit() {
       this.seeker = {
            id: this.user.id,
            fullName: this.candidateForm.value.fullName,
            phone: this.candidateForm.value.phone,
            address: this.candidateForm.value.address,
            gender: this.candidateForm.value.gender,
            status: true,
            dob: this.datePipe.transform(this.candidateForm.value.dob, 'dd/MM/yyyy'),
            updatedAt: this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
            avatar: this.candidateForm.value.avatar
       };
       console.log(this.seeker.updatedAt);
       this.userService.updateCandidate(this.seeker).then(
            (res) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Cập nhật thành công",
                    detail: "Bạn đã cập nhật thông tin thành công."
                });
                localStorage.removeItem('candidate');
                localStorage.setItem('candidate', JSON.stringify(this.seeker));
                this.router.navigate(['/candidate-profile']);
            },
            (err) => {
                this.messageService.add({
                    severity: "error",
                    summary: "Cập nhật thất bại",
                    detail: "Quá trình cập nhật thông tin không thành công. Vui lòng kiểm tra lại."
                });
                this.router.navigate(['/candidate-profile']);
            }
       )
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input && input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                // Gán URL của ảnh vào biến avatarUrl thay vì FormControl
                this.avatarUrl = reader.result as string;
                console.log("ảnh ava: " + this.avatarUrl);
            };

            reader.readAsDataURL(file);
        }
    }
    

    setDefaultAvatar(event: Event) {
        (event.target as HTMLImageElement).src = 'assets/img/dashboard/profile.svg';
    }

    convertDateFormat(dateString: string): string {
        if (!dateString) return '';
    
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`; // Định dạng yyyy-MM-dd
    }
    
}
