import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
    }
    
    // Exchange code for access token using Instagram OAuth
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/oauth/instagram/callback`,
        code: code
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 400 });
    }
    
    // Get user profile using Instagram Graph API
    const profileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${tokenData.access_token}`);
    const profileData = await profileResponse.json();
    
    console.log("Instagram user connected:", profileData);
    
    // Here you would save the connection to your database
    // For now, just return success
    
    return NextResponse.json({ 
      success: true, 
      user: profileData,
      accessToken: tokenData.access_token
    });
    
  } catch (error) {
    console.error("Instagram connect error:", error);
    return NextResponse.json({ error: "Failed to connect Instagram" }, { status: 500 });
  }
}
