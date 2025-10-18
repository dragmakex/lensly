import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api-slop.seraphim.zone';

export async function GET(
  request: NextRequest,
  { params }: { params: { miniappId: string } }
) {
  const { miniappId } = params;
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit') || '100';
  const offset = searchParams.get('offset') || '0';

  try {
    console.log(`Fetching data for miniappId: ${miniappId}, limit: ${limit}, offset: ${offset}`);

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

    console.log(`API Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`API Response Data:`, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      data: data,
      message: data.sources && data.sources.length > 0 ? 'App data found' : 'No data found for this app'
    });

  } catch (error) {
    console.error('App API Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
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
