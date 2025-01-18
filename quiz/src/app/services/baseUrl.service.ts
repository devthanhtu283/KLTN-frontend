import { Injectable } from "@angular/core";

@Injectable()
export class BaseUrlService{
    private BaseUrl: string = "http://localhost:8080/quiz/";
    getBaseUrl(): string {
        return this.BaseUrl;
    }

}