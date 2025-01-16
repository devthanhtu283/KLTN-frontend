export class User {
    id: number;
    username: string;
    password: string;
    user_type: number;
    email: string;
    created: string;
    status: boolean;
    securityCode: string;
}

export class CreateUser {
    username: string;
    password: string;
    user_type: number;
    email: string;
    created: string;
    status: boolean;
    securityCode: string;
}

export class UserUpdatePassword {
    password: string;
}


export class Employee {
    id: number;
    userId: number;
    companyName: string;
    companyProfile: string;
    rating: number;
    contactInfo: string;
    logo: string;
    coverImg: string;
    address: string;
    mapLink: string;
    amount: number;
    status: boolean;
    description: string;
    foundedIn: string;
    companyField: string;
    companyLink: string;
}

export class Seeker {
    id: number;
    fullName: string;
    phone: string;
    address: string;
    dob: string;
    status: boolean;
    updatedAt: string;
    gender: string;
    avatar: string;
}