import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, verifier } = await request.json();
    
    if (!code || !verifier) {
      return NextResponse.json({ error: "Missing code or verifier" }, { status: 400 });
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/oauth/twitter/callback`,
        code_verifier: verifier
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 400 });
    }
    
    // Get user profile
    const profileResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    const profileData = await profileResponse.json();
    
    console.log("Twitter user connected:", profileData);
    
    // Here you would save the connection to your database
    // For now, just return success
    
    return NextResponse.json({ 
      success: true, 
      user: profileData,
      accessToken: tokenData.access_token
    });
    
  } catch (error) {
    console.error("Twitter connect error:", error);
    return NextResponse.json({ error: "Failed to connect Twitter" }, { status: 500 });
  }
}
