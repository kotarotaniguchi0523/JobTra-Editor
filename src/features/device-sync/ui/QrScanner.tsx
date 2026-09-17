'use client';

import { useEffect, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

export function QrScanner(props: {
  onToken: (value: string) => void;
  onError: (error: unknown) => void;
}) {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (video === null) return;
    let cancelled = false;
    let controls: { stop: () => void } | null = null;

    async function scan(): Promise<void> {
      try {
        const reader = new BrowserQRCodeReader();
        controls = await reader.decodeFromConstraints(
          { audio: false, video: { facingMode: { ideal: 'environment' } } },
          video,
          (result) => {
            if (!result || cancelled) return;
            controls?.stop();
            props.onToken(result.getText());
          },
        );
        if (cancelled) controls.stop();
      } catch (error) {
        if (!cancelled) props.onError(error);
      }
    }

    void scan();
    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [props.onError, props.onToken, video]);

  return (
    <video
      ref={setVideo}
      aria-label="QRコードカメラ"
      className="aspect-square w-full rounded-lg bg-neutral-950 object-cover"
      muted
      playsInline
    />
  );
}
