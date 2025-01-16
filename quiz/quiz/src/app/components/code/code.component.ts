import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent {
  testCode: string = '';
 

  constructor(
    private router: Router,
    private testService: TestService
    
    ) {}

  onSubmitCode() {
    this.testService.findTestByCode(this.testCode).then(
      res => {
        console.log(res);
        this.router.navigate(['/test', res.code]);


      },
      err => {
        alert("Sai code");
        this.testCode = "";
      }
    );
    console.log(this.testCode);
     
   
  }
}
