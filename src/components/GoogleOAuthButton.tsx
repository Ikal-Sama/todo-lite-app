"use client";

import React from "react";

import { RiGoogleFill } from "@remixicon/react";

import { Button } from "./ui/button";
import { getGoogleOAuthConsentUrl } from "@/actions/auth.action";
import { toast } from "sonner";

const GoogleOauthButton = () => {
  return (
    <Button
      type='button'
      onClick={async () => {
        const res = await getGoogleOAuthConsentUrl();
        if (res.url) {
          window.location.href = res.url;
        } else {
          toast.error(res.error);
        }
      }}
      className='mt-4  w-full'
      variant='outline'
    >
      <RiGoogleFill /> Login with Google
    </Button>
  );
};

export default GoogleOauthButton;
