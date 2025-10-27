import { NextRequest, NextResponse } from 'next/server';

const NEYNAR_API_BASE = 'https://api.neynar.com/v2/farcaster';
const NEYNAR_API_KEY = process.env.NEXT_NEYNAR_API_KEY;

interface SearchResponse {
  result: {
    users: Array<{
      object: string;
      fid: number;
      username: string;
      display_name: string;
      custody_address: string;
      verified_addresses: {
        eth_addresses: string[];
        primary: {
          eth_address: string;
          sol_address?: string;
        };
      };
    }>;
    next?: {
      cursor: string;
    };
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ q: string }> }
) {
  const { q } = await context.params;

  try {
    if (!NEYNAR_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'API configuration error',
          message: 'Neynar API key not configured'
        },
        { status: 500 }
      );
    }

    // Call Neynar API to search for users
    const neynarUrl = `${NEYNAR_API_BASE}/user/search?q=${encodeURIComponent(q)}&limit=1`;

    const response = await fetch(neynarUrl, {
      method: 'GET',
      headers: {
        'x-api-key': NEYNAR_API_KEY,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Neynar API request failed: ${response.status} ${response.statusText}`);
    }

    const neynarData: SearchResponse = await response.json();

    if (!neynarData.result?.users || neynarData.result.users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: `No users found for "${q}"`
        },
        { status: 404 }
      );
    }

    // Get the first user from search results
    const user = neynarData.result.users[0];

    return NextResponse.json({
      success: true,
      data: {
        fid: user.fid,
        username: user.username,
        display_name: user.display_name,
        verified_addresses: user.verified_addresses
      },
      message: `User found: ${user.username}`
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search for user',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}