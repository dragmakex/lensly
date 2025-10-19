import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api-slop.seraphim.zone';

type RouteContext = {
  params: Promise<{ miniappId: string }> | { miniappId: string };
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { miniappId } = await Promise.resolve(context.params);

  try {
    console.log(`Fetching top users for miniappId: ${miniappId}`);

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

    console.log(`Top Users API Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Top Users API Error Response: ${errorText}`);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const userData = await response.json();
    console.log(`Top Users API Response Data:`, JSON.stringify(userData, null, 2));

    // Process the user data - the structure is sources_usage with farcaster_id and usage_count
    const processedUsers = Array.isArray(userData?.sources_usage) ? userData.sources_usage
      .filter(user => user.farcaster_id && user.farcaster_id !== null && user.farcaster_id !== '')
      .map(user => ({
        user_id: user.farcaster_id,
        user_name: `User ${user.farcaster_id}`,
        count: user.usage_count || 0
      })) : [];

    // Sort by count (descending) and get top 5
    const topUsers = processedUsers
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    console.log(`Top ${topUsers.length} users:`, topUsers);

    return NextResponse.json({
      success: true,
      data: topUsers,
      message: `Top ${topUsers.length} users found`
    });

  } catch (error) {
    console.error('Top Users API Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');

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