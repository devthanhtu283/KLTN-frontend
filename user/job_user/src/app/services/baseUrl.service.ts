import { Injectable } from "@angular/core";

@Injectable()
export class BaseUrlService{
    private BaseUrl: string = "http://localhost:8081/";
    getBaseUrl(): string {
        return this.BaseUrl;
    }

}