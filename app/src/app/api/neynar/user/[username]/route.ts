import { NextRequest, NextResponse } from 'next/server';

const NEYNAR_API_BASE = 'https://api.neynar.com/v2/farcaster';
const NEYNAR_API_KEY = process.env.NEXT_NEYNAR_API_KEY;

interface NeynarUser {
  object: string;
  fid: number;
  username: string;
  display_name: string;
  custody_address: string;
  pfp_url: string;
  follower_count: number;
  following_count: number;
  power_badge: boolean;
  verifications: string[];
}

interface NeynarResponse {
  user: NeynarUser;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    console.log(`Fetching Farcaster user data for username: ${username}`);

    if (!NEYNAR_API_KEY) {
      console.error('Neynar API key not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'API configuration error',
          message: 'Neynar API key not configured'
        },
        { status: 500 }
      );
    }

    // Call Neynar API to get user by username
    const neynarUrl = `${NEYNAR_API_BASE}/user/by_username/?username=${encodeURIComponent(username)}`;

    const response = await fetch(neynarUrl, {
      method: 'GET',
      headers: {
        'x-api-key': NEYNAR_API_KEY,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    console.log(`Neynar API Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Neynar API Error Response: ${errorText}`);

      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: 'User not found on Farcaster',
            message: `Username ${username} not found on Farcaster`
          },
          { status: 404 }
        );
      }

      throw new Error(`Neynar API request failed: ${response.status} ${response.statusText}`);
    }

    const neynarData: NeynarResponse = await response.json();
    console.log(`Neynar API Response Data:`, JSON.stringify(neynarData, null, 2));

    return NextResponse.json({
      success: true,
      data: {
        fid: neynarData.user.fid,
        username: neynarData.user.username,
        display_name: neynarData.user.display_name,
        pfp_url: neynarData.user.pfp_url,
        custody_address: neynarData.user.custody_address,
        follower_count: neynarData.user.follower_count,
        following_count: neynarData.user.following_count,
        power_badge: neynarData.user.power_badge,
        verifications: neynarData.user.verifications
      },
      message: `Farcaster user data found for ${username}`
    });

  } catch (error) {
    console.error('Neynar API Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Farcaster user data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
