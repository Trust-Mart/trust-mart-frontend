import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    // Support multiple files named 'files'
    const files: File[] = [];
    for (const [key, val] of data.entries()) {
      if (val instanceof File && (key === "files" || key.startsWith("file"))) files.push(val);
    }
    if (files.length === 0) {
      const one = data.get("file");
      if (one instanceof File) files.push(one);
    }
    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Upload each with SDK, then convert to gateway URLs
    const results = await Promise.all(
      files.map(async (file) => {
        const { cid } = await pinata.upload.public.file(file);
        const url = await pinata.gateways.public.convert(cid);
        return { cid, url };
      })
    );

    return NextResponse.json(
      { cids: results.map((r) => r.cid), urls: results.map((r) => r.url) },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


