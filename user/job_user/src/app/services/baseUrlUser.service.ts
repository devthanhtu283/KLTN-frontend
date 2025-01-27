import { Injectable } from "@angular/core";

@Injectable()
export class BaseUrlUserService{
    private BaseUrl: string = "http://localhost:8081/user/";
    getBaseUrl(): string {
        return this.BaseUrl;
    }

}