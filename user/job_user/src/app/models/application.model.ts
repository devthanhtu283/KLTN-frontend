export class Application {
    id: number;
    seekerId: number;
    jobId: number;
    employerId: number;
    status: number;
    appliedAt: string;
    seekerName: string;
    jobTitle: string;
    workType: String;
    employerName: string;
    address: string;
    phone: string;
    avatar: string;
    experience: string;
    salary: string;
    companyName: string;
}

export class ApplicationUpdateStatus {
    id: number;
    status: number;
}