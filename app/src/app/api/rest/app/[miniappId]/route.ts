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
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit') || '100';
  const offset = searchParams.get('offset') || '0';

  try {

    const response = await fetch(
      `${API_BASE_URL}/api/rest/app/${encodeURIComponent(miniappId)}?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
      message: data.sources && data.sources.length > 0 ? 'App data found' : 'No data found for this app'
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch app data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
