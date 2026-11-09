import { useEffect, useRef, useState } from "react";
import {
  ZenthcloudLogo,
  PoweredByZenthcloud,
  DropdownMenu,
  generateZenthcloudLogoSvg,
} from "@zenthcloud/kumo";
import {
  CloudIcon,
  CodeIcon,
  DownloadSimpleIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";

const COPIED_FEEDBACK_MS = 2000;

export function ZenthcloudLogoBasicDemo() {
  return <ZenthcloudLogo className="w-72" />;
}

export function ZenthcloudLogoGlyphDemo() {
  return <ZenthcloudLogo variant="glyph" className="w-24" />;
}

export function ZenthcloudLogoColorVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <ZenthcloudLogo className="w-28" color="color" />
      <div className="rounded-lg bg-white p-4">
        <ZenthcloudLogo className="w-28" color="black" />
      </div>
      <div className="rounded-lg bg-black p-4">
        <ZenthcloudLogo className="w-28" color="white" />
      </div>
    </div>
  );
}

export function ZenthcloudLogoGlyphVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <ZenthcloudLogo variant="glyph" className="w-12" color="color" />
      <div className="rounded-lg bg-white p-4">
        <ZenthcloudLogo variant="glyph" className="w-12" color="black" />
      </div>
      <div className="rounded-lg bg-black p-4">
        <ZenthcloudLogo variant="glyph" className="w-12" color="white" />
      </div>
    </div>
  );
}

export function ZenthcloudLogoSizesDemo() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      <ZenthcloudLogo className="w-20" />
      <ZenthcloudLogo className="w-28" />
      <ZenthcloudLogo className="w-44" />
    </div>
  );
}

export function ZenthcloudLogoCopyDemo() {
  const [copied, setCopied] = useState<string | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyAttemptRef = useRef(0);

  useEffect(() => {
    return () => {
      copyAttemptRef.current += 1;
      if (resetTimeoutRef.current !== null) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    const attempt = ++copyAttemptRef.current;
    if (resetTimeoutRef.current !== null) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    try {
      await navigator.clipboard.writeText(text);
      if (copyAttemptRef.current !== attempt) return;

      setCopied(label);
      resetTimeoutRef.current = setTimeout(() => {
        if (copyAttemptRef.current !== attempt) return;
        setCopied(null);
        resetTimeoutRef.current = null;
      }, COPIED_FEEDBACK_MS);
    } catch (error) {
      if (copyAttemptRef.current !== attempt) return;

      setCopied(null);
      console.error("Failed to copy logo SVG:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-black px-4 py-3 text-white transition-opacity hover:opacity-80"
          >
            <ZenthcloudLogo variant="glyph" color="white" className="w-8" />
            <span className="font-medium">Logo</span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            icon={CloudIcon}
            onClick={() =>
              copyToClipboard(
                generateZenthcloudLogoSvg({ variant: "glyph" }),
                "glyph",
              )
            }
          >
            {copied === "glyph" ? "Copied!" : "Copy logo as SVG"}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            icon={CodeIcon}
            onClick={() =>
              copyToClipboard(
                generateZenthcloudLogoSvg({ variant: "full" }),
                "full",
              )
            }
          >
            {copied === "full" ? "Copied!" : "Copy full logo as SVG"}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            icon={DownloadSimpleIcon}
            onClick={() =>
              window.open(
                "https://github.com/skygenesisenterprise/zenthcloud",
                "_blank",
                "noopener",
              )
            }
          >
            Download brand assets
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            icon={ArrowSquareOutIcon}
            onClick={() =>
              window.open(
                "https://github.com/skygenesisenterprise/zenthcloud",
                "_blank",
                "noopener",
              )
            }
          >
            Visit brand guidelines
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>

      <span className="text-sm text-kumo-subtle">
        Click to open the brand assets menu
      </span>
    </div>
  );
}

// =============================================================================
// PoweredByZenthcloud Demos
// =============================================================================

export function PoweredByZenthcloudBasicDemo() {
  return <PoweredByZenthcloud />;
}

export function PoweredByZenthcloudVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <PoweredByZenthcloud />
      <PoweredByZenthcloud color="black" />
      <div className="rounded-lg bg-black p-3">
        <PoweredByZenthcloud color="white" />
      </div>
    </div>
  );
}

export function PoweredByZenthcloudFooterDemo() {
  return (
    <footer className="flex w-full items-center justify-between rounded-lg border border-kumo-hairline bg-kumo-elevated px-6 py-4">
      <span className="text-sm text-kumo-subtle">
        &copy; 2026 Your Company. All rights reserved.
      </span>
      <PoweredByZenthcloud />
    </footer>
  );
}
