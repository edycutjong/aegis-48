import { NextResponse } from 'next/server';
import { getDemoHistory } from '@/data/demo-contracts';

export async function GET() {
  const audits = getDemoHistory();
  return NextResponse.json({ audits });
}
