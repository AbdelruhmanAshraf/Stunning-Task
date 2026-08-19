import { NextRequest, NextResponse } from "next/server";
import { getMockIntegrationResponse, INTEGRATIONS_LIST } from "@/lib/integrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const { integrationId = "stripe", payload = {} } = body as {
      integrationId?: string;
      action?: string;
      payload?: Record<string, unknown>;
    };

    const responseData = getMockIntegrationResponse(integrationId, payload);
    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(getMockIntegrationResponse("stripe"), { status: 200 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const integrationId = searchParams.get("id") || "stripe";
  return NextResponse.json(getMockIntegrationResponse(integrationId));
}
