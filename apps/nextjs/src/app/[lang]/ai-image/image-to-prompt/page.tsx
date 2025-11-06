"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, FileImage, X, Copy, Trash2 } from "lucide-react";

import { Button } from "@saasfly/ui/button";

const AI_MODELS = [
  {
    id: "general",
    name: "General Image Prompt",
    description: "Natural language description of the image",
  },
  {
    id: "flux",
    name: "Flux",
    description: "Optimized for cutting-edge Flux AI model with concise natural language",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "Tailored for Midjourney with Midjourney-specific parameters",
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    description: "Formatted for Stable Diffusion models",
  },
];

export default function ImageToPromptPage() {
  const [selectedModel, setSelectedModel] = useState("general");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
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
      setImageUrl(""); // Clear URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      alert("Please enter an image URL");
      return;
    }

    try {
      // Validate URL format
      new URL(imageUrl);

      // Load image from URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Convert to File object
      const file = new File([blob], "image-from-url.jpg", { type: blob.type });
      setSelectedFile(file);
      setImagePreview(imageUrl);
      setShowUrlInput(false);
    } catch (error) {
      console.error("Error loading image from URL:", error);
      alert("Failed to load image. Please check if the URL is correct");
    }
  };

  const handleGeneratePrompt = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setGeneratedPrompt("");

    try {
      // Step 1: Upload file to Coze
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
        throw new Error(uploadData.error || uploadData.message || "File upload failed");
      }

      const fileId = uploadData.file_id;

      // Step 2: Call workflow to generate prompt
      const generateResponse = await fetch("/api/coze/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id: fileId,
          model_type: selectedModel,
          lang: selectedLanguage,
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        console.error("Generate prompt error:", errorData);
        const errorMsg = errorData.error || "Failed to generate prompt";
        const detailsMsg = errorData.details ? `\nDetails: ${JSON.stringify(errorData.details, null, 2)}` : "";
        const paramsMsg = errorData.sentParameters ? `\nSent parameters: ${JSON.stringify(errorData.sentParameters, null, 2)}` : "";
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
      const errorMessage = error instanceof Error ? error.message : "An error occurred while generating the prompt. Please try again.";
      setGeneratedPrompt(`Error: ${errorMessage}`);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (generatedPrompt) {
      try {
        await navigator.clipboard.writeText(generatedPrompt);
        alert("Prompt copied to clipboard!");
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
      alert("Prompt copied to clipboard!");
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
    if (confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem('image-prompt-history');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Free Image to Prompt Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Convert images into prompts to generate your own images
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
                  <span>Image to Prompt</span>
                </button>
                <button
                  onClick={() => setActiveTab("url")}
                  className={`border-b-2 px-6 py-3 font-medium ${
                    activeTab === "url"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Text to Prompt
                </button>
              </div>

              {/* Upload Area */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex gap-3">
                  <label className="flex-1">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Upload Image
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
                    Enter Image URL
                  </Button>
                </div>

                {/* URL Input */}
                {showUrlInput && (
                  <div className="mb-4 flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL (https://...)"
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUrlSubmit();
                        }
                      }}
                    />
                    <Button onClick={handleUrlSubmit} className="bg-purple-600 hover:bg-purple-700">
                      Load
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
                          Upload photo or drag and drop here
                        </p>
                        <p className="text-sm text-gray-500">Supports PNG, JPG or WEBP, max 4MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* AI Model Selection */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Select AI Model</h3>
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
                <label className="mb-2 block text-lg font-semibold">Prompt Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="中文">Chinese</option>
                  <option value="英文">English</option>
                </select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGeneratePrompt}
                className="w-full bg-purple-600 py-6 text-lg font-semibold hover:bg-purple-700"
                disabled={!imagePreview || isLoading}
              >
                {isLoading ? "Generating..." : "Generate Prompt"}
              </Button>

              <Button
                onClick={() => setShowHistory(true)}
                variant="link"
                className="w-full text-purple-600"
              >
                View History {history.length > 0 && `(${history.length})`}
              </Button>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold">Image Preview</h3>
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
                      <p>Your image will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Generated Prompt */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold">Generated prompt will appear here</h3>
                <div className="min-h-[240px] rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                  {generatedPrompt ? (
                    <p className="text-gray-700 dark:text-gray-300">{generatedPrompt}</p>
                  ) : (
                    <p className="text-gray-400">
                      Upload an image and click "Generate Prompt" to see results
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
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleDownloadPrompt}
                    >
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <h2 className="text-2xl font-bold">History</h2>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <Button
                    onClick={handleClearHistory}
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                  >
                    Clear All
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
                  <p className="text-lg">No history yet</p>
                  <p className="mt-2 text-sm">Generated prompts will be saved here automatically</p>
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
                            title="Copy"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteHistoryItem(item.id)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                            title="Delete"
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
