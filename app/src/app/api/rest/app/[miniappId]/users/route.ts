import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api-slop.seraphim.zone';

type RouteContext = {
  params: Promise<{ miniappId: string }>;
};

interface UserData {
  farcaster_id: string | null;
  username: string | null;
  displayName: string | null;
  pfpUrl: string | null;
  sources_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

interface ApiResponse {
  users: UserData[];
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { miniappId } = await Promise.resolve(context.params);

  try {

    // Use the correct top-users endpoint
    const response = await fetch(
      `${API_BASE_URL}/api/rest/top-users/${encodeURIComponent(miniappId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );


    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const userData: ApiResponse = await response.json();

    // Process the user data from the new API structure
    const processedUsers = userData.users
      .filter((user) => user.farcaster_id != null && user.farcaster_id !== '')
      .map((user) => ({
        user_id: user.farcaster_id!,
        user_name: user.displayName || user.username || user.farcaster_id!,
        count: user.sources_aggregate?.aggregate?.count ?? 0
      }));

    // Sort by count (descending) and get top 5
    const topUsers = processedUsers
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);


    return NextResponse.json({
      success: true,
      data: topUsers,
      message: `Top ${topUsers.length} users found`
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
