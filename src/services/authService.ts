import { UserRole } from "../constants/roles";

export type LoginInput = {
  email?: string;
  password?: string;
  phone?: string;
};

export type SignupInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(input: LoginInput): Promise<{ token: string; role: UserRole }> {
    await wait(700);

    if (input.email && input.password) {
      return { token: "email-token", role: "user" };
    }

    return { token: "phone-token", role: "user" };
  },

  async signup(input: SignupInput): Promise<{ token: string; role: UserRole }> {
    await wait(800);
    return { token: "signup-token", role: input.role };
  },

  async sendOtp(_phone: string): Promise<void> {
    await wait(500);
  },

  async verifyOtp(_phoneOrEmail: string, _otp: string): Promise<{ token: string; role: UserRole }> {
    await wait(700);
    return { token: "otp-token", role: "user" };
  },
};
