import { Suspense } from "react";
import type { Metadata } from "next";

import { getCurrentUser } from "@saasfly/auth";

import { ModalProvider } from "~/components/modal-provider";
import { NavBar } from "~/components/navbar";
import { SiteFooter } from "~/components/site-footer";
import type { Locale } from "~/config/i18n-config";
import { getMarketingConfig } from "~/config/ui/marketing";
import { getDictionary } from "~/lib/get-dictionary";

export const metadata: Metadata = {
  title: "Free Image to Prompt Generator - AI Image Prompt Creator & Tools",
  description: "Transform images into AI prompts with our free image to prompt generator. Create perfect prompts for Midjourney, Stable Diffusion, and DALL-E. AI-powered prompt generator with instant results.",
  keywords: [
    "image to prompt",
    "image to prompt generator",
    "image prompt generator",
    "image prompt",
    "prompt generator",
    "AI prompt generator",
    "Midjourney prompt",
    "Stable Diffusion prompt",
    "free prompt generator",
    "AI image tools",
  ],
  openGraph: {
    title: "Free Image to Prompt Generator - AI Image Prompt Creator",
    description: "Create perfect AI prompts from any image. Free image to prompt generator for Midjourney, Stable Diffusion, and DALL-E.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image to Prompt Generator - AI Image Prompt Creator",
    description: "Transform images into AI prompts instantly. Free, fast, and accurate.",
  },
};

export default async function AIImageLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);
  const user = await getCurrentUser();
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback="...">
        <NavBar
          items={
            (await getMarketingConfig({ params: { lang: `${lang}` } })).mainNav
          }
          params={{ lang: `${lang}` }}
          scroll={true}
          user={user}
          marketing={dict.marketing}
          dropdown={dict.dropdown}
        />
      </Suspense>
      <ModalProvider dict={dict.login} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        className="border-t border-border"
        params={{ lang: `${lang}` }}
        dict={dict.common}
      />
    </div>
  );
}
