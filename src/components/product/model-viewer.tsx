"use client";

import * as React from "react";

// model-viewer is a web component; cast to ElementType so JSX accepts its
// custom attributes without a global declaration.
const MV = "model-viewer" as unknown as React.ElementType;

/** <model-viewer> wrapper (GLB + USDZ, iOS AR Quick Look). */
export function ModelViewer({ src, poster }: { src: string; poster?: string }) {
  React.useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <MV
      src={src}
      poster={poster}
      camera-controls=""
      auto-rotate=""
      ar=""
      shadow-intensity="1"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
