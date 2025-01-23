import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrlService } from './baseUrl.service';
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { Employee, Seeker, User } from '../models/user.model';
@Injectable()
export class UserService{
    private userSubject = new BehaviorSubject<any>(null);
    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient

    ){}

    async login(user: any): Promise<any>{
        return await lastValueFrom(this.httpClient.post(this.baseUrlService.getBaseUrl()
        + 'user/login', user));
    }

    async register(user: any) : Promise<any>{
        return await lastValueFrom(this.httpClient.post(this.baseUrlService.getBaseUrl()
        + 'user/register', user));
    }

    async sendEmail(email: any) : Promise<any> {
        return await lastValueFrom(this.httpClient.post(this.baseUrlService.getBaseUrl()
        + 'user/sendEmail', email));
    }

    async verifyAccount(email: string, securityCode: string) : Promise<any> {
         // Đảm bảo email được mã hóa đúng
         const encodedEmail = encodeURIComponent(email);

        return await lastValueFrom(this.httpClient.get<any>(`${this.baseUrlService.getBaseUrl()}user/verifyAccount?email=${encodedEmail}&securityCode=${securityCode}`));
    }

    async findByEmail(email: string) : Promise<User> {
        const encodedEmail = encodeURIComponent(email);

        return await lastValueFrom(this.httpClient.get<any>(`${this.baseUrlService.getBaseUrl()}user/findByEmail?email=${encodedEmail}`));
    }

    async update(user: User) : Promise<any>{
        return await lastValueFrom(this .httpClient.put(this.baseUrlService.getBaseUrl()
        + 'user/update' , user));
    }
    async test(form: FormData) : Promise<any>{
        return await lastValueFrom(this .httpClient.post(this.baseUrlService.getBaseUrl()
        + 'user/upload', form));
    }

    getAccount() {
        return this.userSubject.asObservable();
    }

    async updateCandidate(formData: FormData): Promise<any> {
        return await lastValueFrom(this.httpClient.post(this.baseUrlService.getBaseUrl()
        + 'seeker/update', formData));
    } 

    async findByIdSeeker(id: number): Promise<any> {
        return await lastValueFrom(this.httpClient.get(this.baseUrlService.getBaseUrl()
        + 'seeker/findById/' + id));
    }

    async updateEmployer(employer: Employee): Promise<any> {
        return await lastValueFrom(this.httpClient.post(this.baseUrlService.getBaseUrl()
        + 'employer/save', employer));
    } 

    async findByIdEmployer(id: number): Promise<any> {
        return await lastValueFrom(this.httpClient.get(this.baseUrlService.getBaseUrl()
        + 'employer/findById/' + id));
    }

    async uploadFile(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);
        return await lastValueFrom(this.httpClient.post(this.baseUrlService.getBaseUrl()
        + 'seeker/upload', formData, { responseType: 'text' }));
    } 

}