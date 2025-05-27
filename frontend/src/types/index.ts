export interface AadhaarData {
  aadhaarNumber?: string;
  name?: string;
  YearOfBirth?: string;
  gender?: string;
  address?: string;
  pincode?: string;
  uid?: string;
  message?: string;
}

export interface ApiResponse {
  status: boolean;
  data?: AadhaarData;
  message: string;
  error?: string;
}