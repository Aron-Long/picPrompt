import Link from "next/link";
import { Image, Wand2, FileText, Sparkles } from "lucide-react";

import { Button } from "@saasfly/ui/button";

export default function AIImagePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl">
          创建更好的 AI 艺术作品
          <br />
          使用 <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI 图像提示词</span>
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          激发灵感，增强图像提示词，创作杰作
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/zh/ai-image/image-to-prompt">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              立即试用！
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            教程
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1: Image to Prompt */}
          <Link href="/zh/ai-image/image-to-prompt">
            <div className="group cursor-pointer rounded-xl border bg-card p-8 text-center transition-all hover:shadow-lg hover:border-purple-600">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900/20">
                  <Image className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold">图片转提示词</h3>
              <p className="text-sm text-muted-foreground">
                将图片转换为提示词，生成您自己的图像
              </p>
            </div>
          </Link>

          {/* Feature 2: Magic Enhance */}
          <div className="group rounded-xl border bg-card p-8 text-center transition-all hover:shadow-lg hover:border-purple-600">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900/20">
                <Wand2 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-semibold">魔法增强</h3>
            <p className="text-sm text-muted-foreground">
              将简单文本转换为详细、描述性的图像提示词
            </p>
          </div>

          {/* Feature 3: AI Describe Image */}
          <div className="group rounded-xl border bg-card p-8 text-center transition-all hover:shadow-lg hover:border-purple-600">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900/20">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-semibold">AI 图像描述</h3>
            <p className="text-sm text-muted-foreground">
              让 AI 帮助您详细理解和分析任何图像
            </p>
          </div>

          {/* Feature 4: AI Image Generator */}
          <div className="group rounded-xl border bg-card p-8 text-center transition-all hover:shadow-lg hover:border-purple-600">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900/20">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-semibold">AI 图像生成器</h3>
            <p className="text-sm text-muted-foreground">
              使用 AI 将您的图像提示词转换为令人惊叹的视觉效果
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          AI 驱动的图像提示词工具
        </h2>
        <p className="text-lg text-muted-foreground">
          一套完整的 AI 工具套件，覆盖图像创作的各个方面
        </p>
      </section>
    </div>
  );
}
