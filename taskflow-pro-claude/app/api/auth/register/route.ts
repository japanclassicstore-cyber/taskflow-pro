import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/db';
import { hashPassword, generateToken, sanitizeUser } from '@/lib/auth';
import { generateId } from '@/lib/utils';
import { User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: generateId(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await createUser(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    return NextResponse.json({
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
