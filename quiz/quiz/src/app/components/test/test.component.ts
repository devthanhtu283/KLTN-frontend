import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Test } from "src/app/models/test.model";
import { QuestionService } from "src/app/services/question.service";
import { TestService } from "src/app/services/test.service";
@Component({
    templateUrl: "./test.component.html"
})
export class TestComponent implements OnInit{
  
   
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

    steps = [];
  
    constructor(
        private route: ActivatedRoute,
        private testService: TestService,
        private questionService: QuestionService
    ) {
     
    
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.code = params.get('code'); 
          });
        
        this.testService.findTestByCode(this.code).then(
            res => {
                this.title = res.title;
                this.questionService.findByTestID(res.id).then(
                  result => {
                      this.steps = result;
                      console.log(result);
                      this.totalSteps = this.steps.length;
                      this.maxScore = this.steps.filter(step => step.questionType === 'choiceAnswer').length * 20;
                      console.log(this.maxScore);
                  }
              );
                
            }
        );
       
        
    }

    getCurrentStep() {
      return this.steps[this.now];
    }
  

    validate(stepId: number): boolean {
      const currentStep = this.steps[stepId - 1];
      if (currentStep.questionType === 'choiceAnswer' && !this.selectedOptions[stepId]) {
        this.errorMsg = 'Hãy chọn đáp án';
        return false;
      } else if (currentStep.questionType === 'textAnswer' && !this.textAnswers[stepId]) {
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
          const correctAnswer = step.answers.find(answer => answer.correct);
          console.log(selectedAnswer);
          console.log(correctAnswer);
          if (selectedAnswer === correctAnswer?.content) {
            this.userScore += 20; 
          }
        }
      });
      this.showResultPage = true;
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
      return this.userScore >= this.passingScore;
    }
}