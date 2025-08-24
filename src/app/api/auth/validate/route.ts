import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const db = getDatabase();
    const storedPassword = db.get('color-feature-password');
    
    if (!storedPassword) {
      return NextResponse.json({ error: 'Authentication system not configured' }, { status: 500 });
    }

    const isValid = password === storedPassword;
    
    if (isValid) {
      return NextResponse.json({ 
        success: true, 
        message: 'Authentication successful' 
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        error: 'Invalid password' 
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Password validation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
