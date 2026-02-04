import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { checkIfAdmin } from "@/utils/checkIfAdmin";

export async function POST(req: NextRequest) {
  try {
    const { userId, fileName, data } = await req.json();

    if (!userId || !fileName || !data) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const isAdmin = await checkIfAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const allowedFiles = ["site.json", "contact.json", "currencies.json"];
    if (!allowedFiles.includes(fileName)) {
      return NextResponse.json({ error: "Invalid config file" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "src", "config", fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}
