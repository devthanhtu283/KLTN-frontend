import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/models/user.model";
import { ChatService } from "src/app/services/chatBot.service";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'seeker-root',
    templateUrl: "./seeker.root.html",
  
  })
export class SeekerRoot implements OnInit{
    user: User | null = null;
    chatMessages: { text: string, isUser: boolean }[] = []; // Mảng lưu trữ tin nhắn
    chatInput: string = ''; // Biến lưu trữ tin nhắn nhập từ người dùng
    isTyping: boolean = false; // Biến kiểm soát trạng thái "Đang nhập..."
    title = 'job_user';
  
    constructor(
      private router: Router,
      private cdr: ChangeDetectorRef,
      private userService: UserService,
      private chatService: ChatService // Thêm ChatService vào constructor
    ) {}
  
    ngOnInit(): void {
        // Lấy user từ localStorage và gán vào biến `user`
        const userData = localStorage.getItem('user');
        if (userData) {
          this.user = JSON.parse(userData);
        }
        this.chatMessages.push({ text: "Xin chào, đây là AI Chatbot thông minh, xin hãy nhập câu hỏi", isUser: false });
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
          const response = await this.chatService.sendMessage(chatInput1, "acc1").toPromise();
          this.chatMessages.push({ text: response.message, isUser: false }); // Thêm phản hồi từ bot
        } catch (error) {
          console.error('Error sending message:', error);
          this.chatMessages.push({ text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', isUser: false });
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
}