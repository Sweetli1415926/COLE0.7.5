export interface LoginUser {
  username: string;
  password: string;
  phoneNumber?: string;
  idCodeLastSixDigits?: string;
  verifyCode?: string;
  checked?: boolean;
  token?: string;
}
