// lib/clipboard.ts
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // First, try the modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback to the older execCommand method
    return fallbackCopyToClipboard(text);
  } catch (error) {
    console.error("Clipboard API failed:", error);
    // Try fallback on any error
    return fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text: string): boolean {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Make it invisible but not display: none (which doesn't work with execCommand)
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";
    textArea.tabIndex = -1;
    // Add to DOM temporarily
    document.body.appendChild(textArea);

    // Select and copy the text
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    // Execute copy command
    const successful = document.execCommand("copy");

    // Clean up
    document.body.removeChild(textArea);

    return successful;
  } catch (error) {
    console.error("Fallback copy failed:", error);
    return false;
  }
}
