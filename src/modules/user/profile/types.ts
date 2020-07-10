export interface UserProfile {
    first_name: string;
    last_name: string;
    dob: string;
    address: string;
    postcode: string;
    city: string;
    country: string;
    state: string;
    created_at: string;
    updated_at: string;
    metadata?: string;
}

export interface User {
    email: string;
    level: number;
    otp: boolean;
    role: string;
    state: string;
    uid: string;
    balance?: object;
    cryptoCurrency: string;
    activeCurrency: string;
    referral_uid?: string;
    profiles: UserProfile[];
    csrf_token?: string;
    data?: string;
}

export interface ProfileIdentity {
    first_name: string;
    last_name: string;
    dob: string;
    address: string;
    postcode: string;
    city: string;
    country: string;
    number: string;
    addAddress?: boolean;
  }
