import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Test } from 'src/app/models/test.model';
import { QuestionService } from 'src/app/services/question.service';
import { TestService } from 'src/app/services/test.service';
import { TestHistoryService } from 'src/app/services/testHistory.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  now: number = 0;
  totalSteps: number;
  selectedOptions: any = {};
  textAnswers: any = {};
  errorMsg: string = '';
  showResultPage: boolean = false;
  userScore: number = 0;
  maxScore: number = 0;
  passingScore: number = 80;
  code: string;
  test: Test;
  title: string;
  companyName: string;
  steps = [];
  startTest: boolean = false; // Biến kiểm soát hiển thị màn hình hướng dẫn
  timeLeft: number = 30 * 60; // Thời gian làm bài: 30 phút (tính bằng giây)
  timerInterval: any; // Biến lưu interval của timer
  userID: number;
  testID: number;
  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private questionService: QuestionService,
    private testHistoryService: TestHistoryService,
    private userService: UserService,
    private router: Router,
     private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const userEmail = localStorage.getItem('userEmail');
    console.log(userEmail);
    if(userEmail == null){
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Thông tin đăng nhập không hợp lệ. Vui lòng thử lại.',
          });

        this.router.navigate(['/login']);
     
    } else {
      this.userService.findByEmail(userEmail).then((res) => {
        console.log(res);
        this.userID = res.data.id;
        console.log(this.userID);
      });
    }
  

    this.route.paramMap.subscribe((params) => {
      this.code = params.get('code');
    });

    this.testService.findTestByCode(this.code).then((res) => {
      console.log(res);
      this.title = res.data.title;
      this.companyName = res.data.username;
      this.questionService.findByTestID(res.data.id).then((result) => {
        this.steps = result;
        console.log(result);
        this.totalSteps = this.steps.length;
        this.maxScore =
          this.steps.filter((step) => step.questionType === 'choiceAnswer')
            .length * 20;
        console.log(this.maxScore);
        this.testID = res.data.id;
        console.log('testID: ' + this.testID);
      });
    });
  }

  // Bắt đầu đếm ngược thời gian
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timerInterval);
        this.calculateScore(); // Tự động tính điểm khi hết giờ
      }
    }, 1000);
  }

  // Định dạng thời gian thành phút:giây
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Các phương thức khác giữ nguyên
  getCurrentStep() {
    return this.steps[this.now];
  }

  validate(stepId: number): boolean {
    const currentStep = this.steps[stepId - 1];
    if (
      currentStep.questionType === 'choiceAnswer' &&
      !this.selectedOptions[stepId]
    ) {
      this.errorMsg = 'Hãy chọn đáp án';
      return false;
    } else if (
      currentStep.questionType === 'textAnswer' &&
      !this.textAnswers[stepId]
    ) {
      this.errorMsg = 'Hãy điền câu trả lời!';
      return false;
    }
    this.errorMsg = '';
    return true;
  }

  nextStep() {
    if (this.validate(this.now + 1)) {
      this.now = this.now + 1;
    }
    if (this.now === this.totalSteps) {
      this.calculateScore();
    }
  }

  prevStep() {
    if (this.now > 0) {
      this.now = this.now - 1;
    }
  }

  calculateScore() {
    this.userScore = 0;
    var i = 0;
    console.log(this.steps);
    this.steps.forEach((step) => {
      i++;
      if (step.questionType === 'choiceAnswer') {
        console.log(this.selectedOptions[i]);
        const selectedAnswer = this.selectedOptions[i];
        const correctAnswer = step.answers.find((answer) => answer.correct);
        console.log(selectedAnswer);
        console.log(correctAnswer);
        if (selectedAnswer === correctAnswer?.content) {
          this.userScore += 20;
        }
      }
    });
    this.showResultPage = true;
    clearInterval(this.timerInterval); // Dừng đếm ngược khi tính điểm
    var contentAnswerText = Object.entries(this.textAnswers)
      .map(([stepId, answer]) => `Câu ${stepId}: ${answer}`)
      .join(' | ');

    var testHistory = {
      userID: this.userID,
      testID: this.testID,
      score: this.userScore,
      contentAnswer: contentAnswerText,
    };

    console.log(testHistory);
    this.testHistoryService.save(testHistory).then((res) => {
      console.log(res);
    });
  }

  onOptionSelected(stepId: number, option: string) {
    this.selectedOptions[stepId] = option;
    console.log(this.selectedOptions[stepId]);
  }

  onTextAnswerChange(stepId: number, answer: string) {
    this.textAnswers[stepId] = answer;
    console.log(this.textAnswers);
  }

  isPassed() {
    return (this.userScore / this.maxScore) * 100 >= this.passingScore;
  }
  goToJobWeb() {
    // Thay thế URL bằng đường dẫn đến trang web công việc của bạn
    window.location.href = 'https://yourjobwebsite.com';
  }
}
