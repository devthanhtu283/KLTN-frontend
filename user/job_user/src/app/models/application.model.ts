export class Application {
    id: number;
    seekerId: number;
    jobId: number;
    employerId: number;
    status: number;
    appliedAt: string;
    seekerName: string;
    jobTitle: string;
    employerName: string;
    address: string;
    phone: string;
    avatar: string;
}

export class ApplicationUpdateStatus {
    id: number;
    status: number;
}