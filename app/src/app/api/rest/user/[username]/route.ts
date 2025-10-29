import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api-slop.seraphim.zone';

type RouteContext = {
  params: Promise<{ username: string }>;
};

interface UserData {
  farcaster_id: string | null;
  username: string | null;
  displayName: string | null;
  pfpUrl: string | null;
  sources: Array<{
    miniapp_id: string;
    source_type: string;
    recorded_at: string;
    features_haptics: boolean | null;
    features_camera_and_microphone_access: boolean | null;
    client_miniapp_platform_type: string | null;
    client_farcaster_id: number | null;
  }>;
  sourcesAggregate: {
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
  const { username } = await Promise.resolve(context.params);

  try {

    // Step 1: Use Neynar API to get FID by username
    let fid: string | null = null;
    let neynarUserData: {
      fid: number;
      username: string;
      display_name: string;
      pfp_url: string;
    } | null = null;

    try {
      const neynarUrl = `https://api.neynar.com/v2/farcaster/user/by_username/?username=${encodeURIComponent(username)}`;
      const neynarApiKey = process.env.NEXT_NEYNAR_API_KEY;

      if (!neynarApiKey) {
        throw new Error('Neynar API key not configured');
      }


      const neynarResponse = await fetch(neynarUrl, {
        method: 'GET',
        headers: {
          'x-api-key': neynarApiKey,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      });


      if (neynarResponse.ok) {
        const neynarData = await neynarResponse.json();

        if (neynarData.user) {
          fid = neynarData.user.fid.toString();
          neynarUserData = neynarData.user;
        }
      } else {
        // Continue to fallback search if Neynar fails
      }
    } catch (neynarError) {
      // Continue to fallback search if Neynar fails
    }

    // Step 2: If we got FID from Neynar, use our REST endpoint to get user data from our DB
    if (fid) {
      try {
        const userResponse = await fetch(
          `${API_BASE_URL}/api/rest/user/${encodeURIComponent(fid)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
          }
        );


        if (userResponse.ok) {
          const userData: ApiResponse = await userResponse.json();

          if (userData.users && userData.users.length > 0) {
            const fullUserData = userData.users[0];

            // Get top apps for this user using their FID
            let topApps = [];
            try {
              const topAppsResponse = await fetch(
                `${API_BASE_URL}/api/rest/top-users/${encodeURIComponent(fid)}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  next: { revalidate: 60 },
                }
              );

              if (topAppsResponse.ok) {
                const topAppsData = await topAppsResponse.json();
                topApps = topAppsData.users || [];
              }
            } catch (topAppsError) {
              // Continue without top apps data
            }

            return NextResponse.json({
              success: true,
              data: {
                user: {
                  farcaster_id: fullUserData.farcaster_id,
                  username: fullUserData.username || neynarUserData?.username || username,
                  displayName: fullUserData.displayName || neynarUserData?.display_name,
                  pfpUrl: fullUserData.pfpUrl || neynarUserData?.pfp_url,
                  sources: fullUserData.sources,
                  sourcesAggregate: fullUserData.sourcesAggregate
                },
                topApps: topApps,
                neynarData: neynarUserData // Include Neynar data for additional info
              },
              message: `User data found for ${username} (using FID: ${fid})`
            });
          }
        } else {
          // User exists on Farcaster but not in our database - return Neynar data only
          return NextResponse.json({
            success: true,
            data: {
              user: {
                farcaster_id: fid,
                username: neynarUserData?.username || username,
                displayName: neynarUserData?.display_name,
                pfpUrl: neynarUserData?.pfp_url,
                sources: [],
                sourcesAggregate: { aggregate: { count: 0 } }
              },
              topApps: [],
              neynarData: neynarUserData
            },
            message: `Farcaster user found for ${username}, but no app usage data in database`
          });
        }
      } catch (dbError) {
        // Continue to fallback if DB query fails
      }
    }

    // Step 3: Fallback - try to find user directly in our database via GraphQL
    const findUserQuery = {
      query: `
        query FindUserByUsername($username: String!) {
          users(where: {username: {_eq: $username}}, limit: 1) {
            farcaster_id
            username
            displayName
            pfpUrl
          }
        }
      `,
      variables: {
        username: username
      }
    };

    const findResponse = await fetch(
      `${API_BASE_URL}/v1/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || 'default-secret'
        },
        body: JSON.stringify(findUserQuery),
        next: { revalidate: 60 },
      }
    );

    if (findResponse.ok) {
      const findData = await findResponse.json();

      if (findData.data && findData.data.users && findData.data.users.length > 0) {
        const user = findData.data.users[0];

        if (user.farcaster_id) {
          // Use the found FID to get full user data from our REST endpoint
          const userResponse = await fetch(
            `${API_BASE_URL}/api/rest/user/${encodeURIComponent(user.farcaster_id)}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              next: { revalidate: 60 },
            }
          );

          if (userResponse.ok) {
            const userData: ApiResponse = await userResponse.json();

            if (userData.users && userData.users.length > 0) {
              const fullUserData = userData.users[0];

              return NextResponse.json({
                success: true,
                data: {
                  user: {
                    farcaster_id: fullUserData.farcaster_id,
                    username: fullUserData.username,
                    displayName: fullUserData.displayName,
                    pfpUrl: fullUserData.pfpUrl,
                    sources: fullUserData.sources,
                    sourcesAggregate: fullUserData.sourcesAggregate
                  },
                  topApps: []
                },
                message: `User data found for ${username} (database fallback)`
              });
            }
          }
        }
      }
    }

    // No user found through any method
    return NextResponse.json({
      success: false,
      error: 'User not found',
      message: `No user found with username: ${username}`
    }, { status: 404 });

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