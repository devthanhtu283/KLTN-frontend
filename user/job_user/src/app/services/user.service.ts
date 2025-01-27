import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from './baseUrl.service';
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { Employee, Seeker, User } from '../models/user.model';
@Injectable()
export class UserService{
    private userSubject = new BehaviorSubject<any>(null);
    constructor(
        private baseUrl: BaseUrl,
        private httpClient: HttpClient

    ){}

    async login(user: any): Promise<any>{
        return await lastValueFrom(this.httpClient.post(this.baseUrl.getUrlUser()
        + 'login', user));
    }

    async register(user: any) : Promise<any>{
        return await lastValueFrom(this.httpClient.post(this.baseUrl.getUrlUser()
        + 'register', user));
    }

    async sendEmail(email: any) : Promise<any> {
        return await lastValueFrom(this.httpClient.post(this.baseUrl.getUrlUser()
        + 'sendEmail', email));
    }

    async verifyAccount(email: string, securityCode: string) : Promise<any> {
         // Đảm bảo email được mã hóa đúng
         const encodedEmail = encodeURIComponent(email);

        return await lastValueFrom(this.httpClient.get<any>(`${this.baseUrl.getUrlUser()}verifyAccount?email=${encodedEmail}&securityCode=${securityCode}`));
    }

    async findByEmail(email: string) : Promise<User> {
        const encodedEmail = encodeURIComponent(email);

        return await lastValueFrom(this.httpClient.get<any>(`${this.baseUrl.getUrlUser()}findByEmail?email=${encodedEmail}`));
    }

    async update(user: User) : Promise<any>{
        return await lastValueFrom(this .httpClient.put(this.baseUrl.getUrlUser()
        + 'update' , user));
    }
    async test(form: FormData) : Promise<any>{
        return await lastValueFrom(this .httpClient.post(this.baseUrl.getUrlUser()
        + 'upload', form));
    }

    getAccount() {
        return this.userSubject.asObservable();
    }

    async updateCandidate(formData: FormData): Promise<any> {
        return await lastValueFrom(this.httpClient.post(this.baseUrl.getUrlUser()
        + 'seeker/update', formData));
    } 

    async findByIdSeeker(id: number): Promise<any> {
        return await lastValueFrom(this.httpClient.get(this.baseUrl.getUrlUser()
        + 'seeker/findById/' + id));
    }

    async updateEmployer(employer: Employee): Promise<any> {
        return await lastValueFrom(this.httpClient.post(this.baseUrl.getUrlUser()
        + 'employer/save', employer));
    } 

    async findByIdEmployer(id: number): Promise<any> {
        return await lastValueFrom(this.httpClient.get(this.baseUrl.getUrlUser()
        + 'employer/findById/' + id));
    }

    async uploadFile(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);
        return await lastValueFrom(this.httpClient.post(this.baseUrl.getUrlUser()
        + 'seeker/upload', formData, { responseType: 'text' }));
    } 

}