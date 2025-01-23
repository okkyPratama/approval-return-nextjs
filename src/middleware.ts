import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === '/unauthorized') {
        return NextResponse.next();
    }
    const token = request.nextUrl.pathname.split('/')[1];

    if (!token) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/user/details`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();
          if (data.status.responseCode !== 200) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
          }
        
    } catch (error) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));

    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!unauthorized|_next/static|_next/image|favicon.ico).*)'
    ]
};