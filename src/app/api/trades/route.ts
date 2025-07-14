import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { message: "Symbol parameter is required" },
        { status: 400 }
      );
    }

    // Default limit is 500, we can fetch a smaller number like 50 for the list.
    const binanceUrl = `https://api.binance.com/api/v3/trades?symbol=${symbol.toUpperCase()}&limit=50`;

    const response = await fetch(binanceUrl);

    if (!response.ok) {
      return NextResponse.json(
        { message: `Error from Binance: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
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
