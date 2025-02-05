export class Job {
    id: number;
    employerId: number;
    experienceId: number;
    locationId: number;
    worktypeId: number;
    employerName: string;
    experienceName: string;
    locationName: string;
    worktypeName: string;
    title: string;
    description: string;
    required: string;
    address: string;
    salary: string;
    status: boolean;
    postedAt: string;
    postedExpired: string;
    requiredSkills: string;
    member: string;
    checkFavorited: boolean;
}
export class Location{
    id: number;
    name: string;
    status: boolean;
}
export class Experience{
    id: number;
    name: string;
    status: boolean;
}
export class Worktype{
    id: number;
    name: string;
    status: boolean;
}