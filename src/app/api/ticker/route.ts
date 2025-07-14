import { NextResponse } from "next/server";

// We can use edge functions for better performance and to avoid cold starts
export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get("symbols");

    if (!symbols) {
      return NextResponse.json(
        { message: "Symbols parameter is required" },
        { status: 400 }
      );
    }

    // The symbols parameter is already a stringified JSON array, so we can pass it directly.
    const binanceUrl = `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`;

    const response = await fetch(binanceUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Forward the error from Binance API
      return NextResponse.json(
        { message: `Error from Binance: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        // Optional: Set caching headers
        "Cache-Control": "s-maxage=3, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Proxy API Error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Internal Server Error: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown internal server error occurred" },
      { status: 500 }
    );
  }
}
