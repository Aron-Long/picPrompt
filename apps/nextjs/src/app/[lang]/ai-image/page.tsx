import Link from "next/link";
import { Image, Wand2, FileText, Sparkles } from "lucide-react";

import { Button } from "@saasfly/ui/button";

export default function AIImagePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl">
          Free Image to Prompt Generator
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Image Prompt Creator</span>
        </h1>
        <p className="mb-4 text-xl text-muted-foreground">
          Transform images into AI prompts instantly with our free image prompt generator
        </p>
        <p className="mb-8 text-lg text-muted-foreground max-w-3xl mx-auto">
          Create perfect prompts for Midjourney, Stable Diffusion, and DALL-E. Our AI-powered prompt generator analyzes your images and generates detailed, accurate prompts in seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/zh/ai-image/image-to-prompt">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Try Image to Prompt Generator Free →
            </Button>
          </Link>
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
              <h3 className="mb-3 text-xl font-semibold">Image to Prompt</h3>
              <p className="text-sm text-muted-foreground">
                Convert any image into detailed AI prompts for image generation
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
            <h3 className="mb-3 text-xl font-semibold">Prompt Enhancer</h3>
            <p className="text-sm text-muted-foreground">
              Transform simple text into detailed, descriptive image prompts
            </p>
          </div>

          {/* Feature 3: AI Describe Image */}
          <div className="group rounded-xl border bg-card p-8 text-center transition-all hover:shadow-lg hover:border-purple-600">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900/20">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-semibold">AI Image Analyzer</h3>
            <p className="text-sm text-muted-foreground">
              Let AI help you understand and analyze any image in detail
            </p>
          </div>

          {/* Feature 4: AI Image Generator */}
          <div className="group rounded-xl border bg-card p-8 text-center transition-all hover:shadow-lg hover:border-purple-600">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900/20">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-semibold">AI Image Generator</h3>
            <p className="text-sm text-muted-foreground">
              Turn your image prompts into stunning visuals with AI
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="mb-20 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          AI-Powered Image Prompt Tools
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Complete AI toolkit for all your image creation needs
        </p>
      </section>

      {/* SEO Content Section */}
      <section className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-card border p-8 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold">
            Why Use Our Image to Prompt Generator?
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Our <strong>image to prompt generator</strong> is the perfect tool for artists, designers, and AI enthusiasts who want to create better AI art. Whether you're using Midjourney, Stable Diffusion, or DALL-E, our <strong>image prompt generator</strong> helps you create detailed, accurate prompts from any image.
            </p>

            <h3 className="mt-8 mb-4 text-2xl font-bold text-foreground">
              Key Benefits of Our Prompt Generator
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Free Image to Prompt Conversion:</strong> No subscription required - use our image prompt generator completely free</li>
              <li><strong>AI-Powered Analysis:</strong> Advanced AI understands your images and creates perfect prompts</li>
              <li><strong>Multiple AI Models:</strong> Optimized for Midjourney, Stable Diffusion, Flux, and more</li>
              <li><strong>Instant Results:</strong> Get your image prompts in seconds, not minutes</li>
              <li><strong>Professional Quality:</strong> Generate prompts that capture every detail of your images</li>
            </ul>

            <h3 className="mt-8 mb-4 text-2xl font-bold text-foreground">
              Perfect For
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Digital artists creating AI art with Midjourney or Stable Diffusion</li>
              <li>Designers needing consistent image generation prompts</li>
              <li>Content creators looking to replicate or remix existing images</li>
              <li>AI enthusiasts experimenting with different prompt styles</li>
              <li>Anyone who wants to understand how to write better image prompts</li>
            </ul>

            <p className="mt-6">
              Start using our free <strong>image to prompt generator</strong> today and transform the way you create AI art. Our <strong>prompt generator</strong> makes it easy to go from image to prompt in just a few clicks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
