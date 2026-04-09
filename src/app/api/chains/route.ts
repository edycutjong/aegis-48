import { NextResponse } from 'next/server';
import { CHAINS } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({ chains: CHAINS });
}
