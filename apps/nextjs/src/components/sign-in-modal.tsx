"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { Modal } from "~/components/modal";
import { useSigninModal } from "~/hooks/use-signin-modal";

export const SignInModal = ({ dict }: { dict: Record<string, string> }) => {
  const signInModal = useSigninModal();
  const [signInClicked, setSignInClicked] = useState(false);

  return (
    <Modal showModal={signInModal.isOpen} setShowModal={signInModal.onClose}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-neutral-200 dark:border-neutral-800 bg-background px-4 py-6 pt-8 text-center md:px-16">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ImagePrompt
          </h1>
          <h3 className="font-urban text-2xl font-bold">{dict.signup}</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">{dict.privacy}</p>
        </div>

        <div className="flex flex-col space-y-4 px-4 py-8 md:px-16">
          <Button
            variant="default"
            disabled={signInClicked}
            onClick={() => {
              setSignInClicked(true);
              signIn("google", { redirect: false })
                .then(() =>
                  setTimeout(() => {
                    signInModal.onClose();
                  }, 1000),
                )
                .catch((error) => {
                  console.error("signUp failed:", error);
                  setSignInClicked(false);
                });
            }}
          >
            {signInClicked ? (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.Google className="mr-2 h-4 w-4" />
            )}{" "}
            Continue with Google
          </Button>
        </div>
      </div>
    </Modal>
  );
};
