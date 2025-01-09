"use client";
import { useEffect } from "react";
import TagManager from "react-gtm-module";

function GTMInitialiser() {
  useEffect(() => {
    const tagManagerArgs = {
      gtmId: "GTM-T7VN3NH9",
    };

    TagManager.initialize(tagManagerArgs);
  }, []);
  return null;
}

export default GTMInitialiser;