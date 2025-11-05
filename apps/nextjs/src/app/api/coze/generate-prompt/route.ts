import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
// Force recompile to enable debug logging

interface WorkflowParams {
  file_id: string;
  model_type?: string;
  lang?: string; // 改为 lang 参数
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { file_id, model_type = "general", lang = "中文" } = body as WorkflowParams;

    if (!file_id) {
      return NextResponse.json(
        { error: "No file_id provided" },
        { status: 400 },
      );
    }

    const cozeApiToken = process.env.COZE_API_TOKEN;
    const workflowId = process.env.COZE_WORKFLOW_ID;

    if (!cozeApiToken || !workflowId) {
      return NextResponse.json(
        { error: "Coze API credentials not configured" },
        { status: 500 },
      );
    }

    // 映射模型类型到 promptType
    const promptTypeMap: Record<string, string> = {
      general: "normal",
      flux: "flux",
      midjourney: "midjourney",
      "stable-diffusion": "stableDiffusion",
    };

    const promptType = promptTypeMap[model_type] || "normal";

    // 构建工作流参数 - 根据实际的 Coze API 结构
    const parameters = {
      userQuery: "请描述这个图片",
      img: { file_id: file_id },
      promptType: promptType,
      lang: lang,  // lang 作为独立参数
    };

    console.log("Calling Coze workflow with parameters:", JSON.stringify(parameters));
    console.log("Workflow ID:", workflowId);

    // 调用 Coze 工作流 API
    const response = await fetch("https://api.coze.cn/v1/workflow/run", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cozeApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        parameters,
      }),
    });

    console.log("Coze workflow response status:", response.status);
    const result = await response.json();
    console.log("Coze workflow response:", JSON.stringify(result));

    if (result.code !== 0) {
      console.error("Coze workflow failed:", result);
      return NextResponse.json(
        {
          error: result.msg || "Failed to execute workflow",
          details: result,
          sentParameters: parameters
        },
        { status: 500 },
      );
    }

    // 解析工作流返回的数据
    let promptData;
    try {
      promptData = JSON.parse(result.data);
    } catch {
      promptData = { output: result.data };
    }

    return NextResponse.json({
      success: true,
      prompt: promptData.output || promptData,
      debug_url: result.debug_url,
      usage: result.usage,
    });
  } catch (error) {
    console.error("Error executing Coze workflow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
