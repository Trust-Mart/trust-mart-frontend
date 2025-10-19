import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { accessToken, userID } = await request.json();
    
    // Verify the token with Facebook
    const fbResponse = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`);
    const fbUser = await fbResponse.json();
    
    if (!fbUser.id) {
      return NextResponse.json({ error: "Invalid Facebook token" }, { status: 400 });
    }
    
    // Here you would save the connection to your database
    // For now, just return success
    console.log("Facebook user connected:", fbUser);
    
    return NextResponse.json({ 
      success: true, 
      user: fbUser 
    });
    
  } catch (error) {
    console.error("Facebook connect error:", error);
    return NextResponse.json({ error: "Failed to connect Facebook" }, { status: 500 });
  }
}
