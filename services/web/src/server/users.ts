'use server';
import { auth } from '@/lib/auth';

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({ body: { email, password } });
    return {
      success: true,
      message: 'Signed in successfully',
    };
  } catch (error) {
    let message = 'An unexpected error occurred';
    if (error instanceof Error) {
      message = error.message ?? message;
    }
    return {
      success: false,
      message,
    };
  }
};

export const signUp = async (name: string, email: string, password: string) => {
  try {
    await auth.api.signUpEmail({ body: { name, email, password } });
    return {
      success: true,
      message: 'Signed in successfully',
    };
  } catch (error) {
    let message = 'An unexpected error occurred';
    if (error instanceof Error) {
      message = error.message ?? message;
    }
    return {
      success: false,
      message,
    };
  }
};
