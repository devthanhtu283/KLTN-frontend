import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit{
  testCode: string = '';
 
  ngOnInit(): void {
    const userEmail = localStorage.getItem('userEmail');
    console.log(userEmail);
    if(userEmail == null){
       
   
        this.router.navigate(['/login']);
 
    } 
  }

  constructor(
    private router: Router,
    private testService: TestService,
    private messageService: MessageService
    ) {}

  onSubmitCode() {
    this.testService.findTestByCode(this.testCode).then(
      res => {
        console.log(res.data.code);
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Mã code hợp lệ. Đang chuyển hướng...',
        });
        setTimeout(() => {
          this.router.navigate(['/test', res.data.code]);
        }, 1000);
      


      },
      err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Mã code không hợp lệ. Vui lòng kiểm tra lại.',
        });
        this.testCode = "";
      }
    );
    console.log(this.testCode);
     
   
  }
}
