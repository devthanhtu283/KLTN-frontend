import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job.service';

@Component({
  templateUrl: './seeker-resume.component.html',
  styleUrls: ['./seeker-resume.component.css'],
})
export class SeekerResumeComponent implements OnInit {
  skillInput: string = '';
  allSkills: string[] = []; // Danh sách tất cả các skill từ API
  filteredSkills: string[] = []; // Danh sách skill được gợi ý
  selectedSkills: string[] = []; // Danh sách skill đã chọn
  uploadedCV: { name: string; size: string } | null = null;
  availableSkills: string[] = ['JavaScript', 'Python', 'Java', 'CSS', 'HTML', 'React', 'Node.js'];

  savedCVs: { name: string; size: string }[] = [
    { name: 'ThanhTuCV.pdf', size: '0.24 MB' },
    { name: 'Nghiên cứu VIT.pdf', size: '2.82 MB' },
  ];
  educationData: string[] = [
    'Harvard University - 2018/09/01 - 2022/06/30 - Bachelor of Science in Computer Science',
    'Harvard University - 2018/09/01 - 2022/06/30 - Bachelor of Science in Computer Science',
    'Harvard University - 2018/09/01 - 2022/06/30 - Bachelor of Science in Computer Science',
  ];

  educations: {
    university: string;
    startDate: string;
    endDate: string;
    description: string;
  }[] = [];

  experiences = [
    {
      company: 'Google',
      startDate: '2020-01-01',
      endDate: '2022-06-30',
      description: 'Software Engineer working on backend services.',
    },
    {
      company: 'Facebook',
      startDate: '2018-06-01',
      endDate: '2019-12-31',
      description: 'Frontend Developer, building user interfaces.',
    },
  ];

  constructor(private jobService: JobService) {
    this.parseEducationData();
  }

  ngOnInit(): void {
    this.jobService.skillFindAll().then((res) => {
      this.allSkills = res.map((skill) => skill.name);
    });
  }

  // Lọc skill dựa trên input người dùng
  filterSkills(): void {
    this.filteredSkills = this.allSkills
      .filter((skill) =>
        skill.toLowerCase().includes(this.skillInput.toLowerCase())
      )
      .slice(0, 5); // Giới hạn số lượng gợi ý
  }

  // Thêm skill vào danh sách
  addSkill(skill: string): void {
    if (!this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
    }
    this.skillInput = '';
    this.filteredSkills = [];
  }

  // Xóa skill khỏi danh sách
  removeSkill(skill: string): void {
    this.selectedSkills = this.selectedSkills.filter((s) => s !== skill);
  }
  uploadCV(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
      this.uploadedCV = { name: file.name, size: fileSize };
    }
  }

  // Lưu CV vào danh sách đã lưu
  saveCV() {
    if (this.uploadedCV) {
      this.savedCVs.push(this.uploadedCV);
      this.uploadedCV = null; // Reset sau khi lưu
    }
  }

  // Xóa CV khỏi danh sách đã lưu
  removeSavedCV(cv: any) {
    this.savedCVs = this.savedCVs.filter((item) => item !== cv);
  }
  // Hiển thị form thêm education
  parseEducationData() {
    this.educations = this.educationData.map((edu) => {
      const parts = edu.split(' - ');
      return {
        university: parts[0],
        startDate: parts[1],
        endDate: parts[2],
        description: parts[3],
      };
    });
  }
}
