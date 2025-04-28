export interface Profile {
    id: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    created_at: string;
    updated_at: string;
}

export interface DoctorProfile {
    id: string;
    name: string;
    title: string;
    chuyen_khoa: string;
    kinh_nghiem?: string[];
    linh_vuc_chuyen_sau?: string[];
    ngay_lam_viec?: string[];
    lich_lam_viec?: Record<string, any>;
    image_url?: string;
    created_at: string;
    updated_at: string;
    chung_nhan?: string;
    display_order?: number;
}

export interface Appointment {
    id: string;
    full_name: string;
    phone: string;
    birth_date: string;
    address: string;
    department: string;
    appointment_date: string;
    appointment_time: string;
    created_at: string;
    status: string;
    notes?: string;
    user_id?: string;
    doctor_id?: string;
}

export interface DichVuKham {
    id: number;
    stt?: number;
    ten_dich_vu: string;
    don_vi_tinh?: string;
    muc_gia?: number;
}

export interface HealthArticle {
    id: string;
    title: string;
    category: string;
    image_url?: string;
    excerpt: string;
    content: Record<string, any>;
    author: string;
    date: string;
    read_time: string;
    created_at: string;
    updated_at: string;
}

export interface Database {
    profiles: Profile[];
    doctor_profiles: DoctorProfile[];
    appointments: Appointment[];
    dich_vu_kham: DichVuKham[];
    health_articles: HealthArticle[];
}
