"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, FileImage, X, Copy, Trash2 } from "lucide-react";

import { Button } from "@saasfly/ui/button";

const AI_MODELS = [
  {
    id: "general",
    name: "通用图像提示词",
    description: "图像的自然语言描述",
  },
  {
    id: "flux",
    name: "Flux",
    description: "针对最先进的 Flux AI 模型进行优化，简洁的自然语言",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "为 Midjourney 生成量身定制，包含 Midjourney 参数",
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    description: "为 Stable Diffusion 模型格式化",
  },
];

export default function ImageToPromptPage() {
  const [selectedModel, setSelectedModel] = useState("general");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("中文");
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Array<{
    id: string;
    prompt: string;
    modelType: string;
    language: string;
    timestamp: number;
  }>>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('image-prompt-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(""); // 清除 URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      alert("请输入图片 URL");
      return;
    }

    try {
      // 验证 URL 格式
      new URL(imageUrl);

      // 从 URL 加载图片
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // 转换为 File 对象
      const file = new File([blob], "image-from-url.jpg", { type: blob.type });
      setSelectedFile(file);
      setImagePreview(imageUrl);
      setShowUrlInput(false);
    } catch (error) {
      console.error("Error loading image from URL:", error);
      alert("无法加载图片,请检查 URL 是否正确");
    }
  };

  const handleGeneratePrompt = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setGeneratedPrompt("");

    try {
      // 第一步: 上传文件到 Coze
      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log("Uploading file:", selectedFile.name, selectedFile.size);
      const uploadResponse = await fetch("/api/coze/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload response status:", uploadResponse.status);
      const uploadData = await uploadResponse.json();
      console.log("Upload response data:", uploadData);

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || uploadData.message || "文件上传失败");
      }

      const fileId = uploadData.file_id;

      // 第二步: 调用工作流生成提示词
      const generateResponse = await fetch("/api/coze/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id: fileId,
          model_type: selectedModel,
          lang: selectedLanguage, // 改为 lang 参数
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        console.error("Generate prompt error:", errorData);
        const errorMsg = errorData.error || "生成提示词失败";
        const detailsMsg = errorData.details ? `\n详情: ${JSON.stringify(errorData.details, null, 2)}` : "";
        const paramsMsg = errorData.sentParameters ? `\n发送参数: ${JSON.stringify(errorData.sentParameters, null, 2)}` : "";
        throw new Error(errorMsg + detailsMsg + paramsMsg);
      }

      const generateData = await generateResponse.json();
      setGeneratedPrompt(generateData.prompt);

      // Save to history
      const newHistoryItem = {
        id: Date.now().toString(),
        prompt: generateData.prompt,
        modelType: selectedModel,
        language: selectedLanguage,
        timestamp: Date.now(),
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 50); // Keep only last 50 items
      setHistory(updatedHistory);
      localStorage.setItem('image-prompt-history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error generating prompt:", error);
      const errorMessage = error instanceof Error ? error.message : "生成提示词时出错,请重试。";
      setGeneratedPrompt(`错误: ${errorMessage}`);
      alert(`错误: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (generatedPrompt) {
      try {
        await navigator.clipboard.writeText(generatedPrompt);
        alert("提示词已复制到剪贴板!");
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const handleDownloadPrompt = () => {
    if (generatedPrompt) {
      const blob = new Blob([generatedPrompt], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prompt.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyHistoryItem = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      alert("提示词已复制到剪贴板!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('image-prompt-history', JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    if (confirm("确定要清空所有历史记录吗?")) {
      setHistory([]);
      localStorage.removeItem('image-prompt-history');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/zh/ai-image" className="flex items-center space-x-2">
            <FileImage className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold">ImagePrompt.org</span>
          </Link>
          <nav className="hidden space-x-6 md:flex">
            <Link href="/zh/ai-image" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
              首页
            </Link>
            <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">灵感</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">教程</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">工具</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">定价</a>
          </nav>
          <Button variant="outline">登录</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            免费图片转提示词生成器
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            将图片转换为提示词以生成您自己的图像
          </p>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`flex items-center space-x-2 border-b-2 px-6 py-3 font-medium ${
                    activeTab === "upload"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <FileImage className="h-5 w-5" />
                  <span>图片转提示词</span>
                </button>
                <button
                  onClick={() => setActiveTab("url")}
                  className={`border-b-2 px-6 py-3 font-medium ${
                    activeTab === "url"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-600 dark:text-gray-400"
                  }`}
                >
                  文本转提示词
                </button>
              </div>

              {/* Upload Area */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex gap-3">
                  <label className="flex-1">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      上传图片
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                  >
                    输入图片链接
                  </Button>
                </div>

                {/* URL Input */}
                {showUrlInput && (
                  <div className="mb-4 flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="输入图片 URL (https://...)"
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUrlSubmit();
                        }
                      }}
                    />
                    <Button onClick={handleUrlSubmit} className="bg-purple-600 hover:bg-purple-700">
                      加载
                    </Button>
                  </div>
                )}

                <label
                  htmlFor="file-upload"
                  className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-16 text-center dark:border-gray-600 dark:bg-gray-700 hover:border-purple-400 hover:bg-gray-100 dark:hover:border-purple-500 dark:hover:bg-gray-600 transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto max-h-64 rounded"
                    />
                  ) : (
                    <div className="space-y-3">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          上传照片或拖放到此处
                        </p>
                        <p className="text-sm text-gray-500">支持 PNG、JPG 或 WEBP 格式，最大 4MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* AI Model Selection */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">选择 AI 模型</h3>
                <div className="space-y-3">
                  {AI_MODELS.map((model) => (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`cursor-pointer rounded-lg border p-4 transition-all ${
                        selectedModel === model.id
                          ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{model.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {model.description}
                          </p>
                        </div>
                        {selectedModel === model.id && (
                          <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs text-white">
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="mb-2 block text-lg font-semibold">提示词语言</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="中文">中文</option>
                  <option value="英文">English</option>
                </select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGeneratePrompt}
                className="w-full bg-purple-600 py-6 text-lg font-semibold hover:bg-purple-700"
                disabled={!imagePreview || isLoading}
              >
                {isLoading ? "生成中..." : "生成提示词"}
              </Button>

              <Button
                onClick={() => setShowHistory(true)}
                variant="link"
                className="w-full text-purple-600"
              >
                查看历史记录 {history.length > 0 && `(${history.length})`}
              </Button>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold">图片预览</h3>
                <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-full max-w-full rounded object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FileImage className="mx-auto mb-2 h-12 w-12" />
                      <p>您的图片将显示在这里</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Generated Prompt */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold">生成的提示词将显示在这里</h3>
                <div className="min-h-[240px] rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                  {generatedPrompt ? (
                    <p className="text-gray-700 dark:text-gray-300">{generatedPrompt}</p>
                  ) : (
                    <p className="text-gray-400">
                      上传图片并点击"生成提示词"按钮以查看结果
                    </p>
                  )}
                </div>
                {generatedPrompt && (
                  <div className="mt-4 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCopyPrompt}
                    >
                      复制
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleDownloadPrompt}
                    >
                      下载
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-12 text-center dark:from-amber-900/20 dark:to-orange-900/20">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              高精度图片转提示词生成
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              将原始图片转换为提示词，并用 AI 重新生成以查看我们的提示词准确性
            </p>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <h2 className="text-2xl font-bold">历史记录</h2>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <Button
                    onClick={handleClearHistory}
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                  >
                    清空全部
                  </Button>
                )}
                <Button
                  onClick={() => setShowHistory(false)}
                  variant="outline"
                  className="h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(90vh-100px)] overflow-y-auto p-6">
              {history.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <FileImage className="mx-auto mb-4 h-16 w-16" />
                  <p className="text-lg">暂无历史记录</p>
                  <p className="mt-2 text-sm">生成提示词后会自动保存在这里</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{formatTimestamp(item.timestamp)}</span>
                            <span>•</span>
                            <span className="font-medium">
                              {AI_MODELS.find(m => m.id === item.modelType)?.name || item.modelType}
                            </span>
                            <span>•</span>
                            <span>{item.language}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCopyHistoryItem(item.prompt)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="复制"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteHistoryItem(item.id)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                            title="删除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {item.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
