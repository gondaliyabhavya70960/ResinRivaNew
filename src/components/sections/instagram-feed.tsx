"use client";

import * as React from "react";

// The Behold widget registers a <behold-widget> custom element. Cast the tag to
// an ElementType so JSX/TS accept it and its `feed-id` attribute (same approach
// as the model-viewer web component).
const BeholdWidget = "behold-widget" as unknown as React.ElementType;

const WIDGET_SRC = "https://w.behold.so/widget.js";

/**
 * Live Instagram feed via Behold (https://behold.so). Loads the widget script
 * once on the client and renders the feed for the given Behold feed id.
 */
export function InstagramFeed({ feedId }: { feedId: string }) {
  React.useEffect(() => {
    if (document.querySelector(`script[src="${WIDGET_SRC}"]`)) return;
    const s = document.createElement("script");
    s.type = "module";
    s.src = WIDGET_SRC;
    document.head.append(s);
  }, []);

  return <BeholdWidget feed-id={feedId} />;
}
