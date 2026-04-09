import { NextResponse } from 'next/server';
import { analyzeContract } from '@/lib/analyzer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, chainId } = body;

    if (!address || !chainId) {
      return NextResponse.json(
        { error: 'Missing address or chainId' },
        { status: 400 }
      );
    }

    const report = await analyzeContract(address, chainId);

    return NextResponse.json({ audit: report });
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
