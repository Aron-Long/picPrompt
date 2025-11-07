import { NextRequest, NextResponse } from "next/server";
import { uploadToOSS } from "~/lib/oss";

// Note: OSS SDK doesn't work in edge runtime, so we need to use nodejs runtime
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 },
      );
    }

    const cozeApiToken = process.env.COZE_API_TOKEN;
    if (!cozeApiToken) {
      console.error("COZE_API_TOKEN not configured");
      return NextResponse.json(
        { error: "Coze API token not configured" },
        { status: 500 },
      );
    }

    console.log("Uploading file to Coze:", file.name, file.size, "bytes");

    // Upload to Alibaba Cloud OSS first
    let ossResult;
    try {
      ossResult = await uploadToOSS(file, "image-to-prompt");
      console.log("File uploaded to OSS:", ossResult.url);
    } catch (ossError) {
      console.error("OSS upload error:", ossError);
      // Continue with Coze upload even if OSS fails
      console.log("Continuing with Coze upload despite OSS error");
    }

    // 创建新的 FormData 发送到 Coze API
    const cozeFormData = new FormData();
    cozeFormData.append("file", file);

    // 调用 Coze 文件上传接口
    const response = await fetch("https://api.coze.cn/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cozeApiToken}`,
      },
      body: cozeFormData,
    });

    console.log("Coze API response status:", response.status);
    const result = await response.json();
    console.log("Coze API response:", JSON.stringify(result));

    if (result.code !== 0) {
      console.error("Coze API error:", result);
      return NextResponse.json(
        { error: result.msg || "Failed to upload file to Coze", details: result },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      file_id: result.data.id,
      file_name: result.data.file_name,
      bytes: result.data.bytes,
      oss_url: ossResult?.url,
      oss_path: ossResult?.path,
    });
  } catch (error) {
    console.error("Error uploading file to Coze:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
