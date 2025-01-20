import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import styles from "./App.module.css";
import formatXML from "../utils/format-xml";
import generateXml from "../utils/generate-xml";
import JSZip from "jszip";
import formatFileName from "../utils/format-file-name";
import { ThemeToggle } from "./components/theme-toggle";

// Enhanced metadata for SEO
const metadata = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SVG to Android Vector Drawable Converter",
  description:
    "Free online tool to convert SVG files to Android Vector Drawable format. Batch convert multiple SVG files, with instant preview and download options.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  creator: {
    "@type": "Organization",
    name: "SVG to Vector Drawable Converter",
  },
  browserRequirements: "Requires JavaScript. Works in all modern browsers.",
  softwareVersion: "1.0",
  fileFormat: ["SVG", "XML"],
  permissions: "No installation required",
  url: window.location.href,
  image: "path-to-your-app-screenshot.png", // Add your actual screenshot path
  datePublished: "2024-01-01", // Add actual publication date
  keywords:
    "SVG converter, Android Vector Drawable, XML converter, SVG to XML, mobile development tools, Android development",
};

// Enhanced page metadata
const pageTitle =
  "SVG to Android Vector Drawable Converter | Free Online Batch Converter";
const pageDescription =
  "Convert SVG files to Android Vector Drawable format instantly. Free online tool supporting batch conversion, preview, and ZIP downloads. No installation required.";

const App: Component = () => {
  const [svgContents, setSvgContents] = createSignal<{ [key: string]: string }>(
    {}
  );
  const [androidVectors, setAndroidVectors] = createSignal<{
    [key: string]: string;
  }>({});

  let fileInputRef: HTMLInputElement | undefined;

  const handleFileUpload = async (files?: FileList | null) => {
    if (!files || files.length === 0) return;

    const newSvgContents: { [key: string]: string } = {};
    const newAndroidVectors: { [key: string]: string } = {};

    for (const file of Array.from(files)) {
      if (file.type !== "image/svg+xml") {
        alert(`${file.name} is not an SVG file. Skipping...`);
        continue;
      }

      const content = await file.text();
      newSvgContents[file.name] = content;

      // Parse the SVG content
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(content, "image/svg+xml");
      const pathElement = svgDoc.querySelector("path");
      const pathData = pathElement?.getAttribute("d") || "";

      newAndroidVectors[file.name] = formatXML(generateXml(pathData));
    }

    setSvgContents((prev) => ({ ...prev, ...newSvgContents }));
    setAndroidVectors((prev) => ({ ...prev, ...newAndroidVectors }));
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer?.files);
  };

  const handleDropzoneClick = (e: MouseEvent) => {
    // Prevent triggering when clicking on preview items
    if ((e.target as HTMLElement).closest(`.${styles.preview}`)) return;

    fileInputRef?.click();
  };

  const downloadVectors = () => {
    const vectors = androidVectors();
    if (Object.keys(vectors).length === 1) {
      // Single file download
      const fileName = Object.keys(vectors)[0];
      const blob = new Blob([vectors[fileName]], { type: "text/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = formatFileName(fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Multiple files - create zip
      const zip = new JSZip();
      Object.entries(vectors).forEach(([fileName, content]) => {
        zip.file(formatFileName(fileName), content);
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "vector_drawables.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  };

  return (
    <div class={styles.app}>
      <header class={styles.header}>
        {/* Add meta tags for better SEO */}
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={metadata.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        <ThemeToggle />
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
      </header>

      <main class={styles.mainContent}>
        {/* Schema.org metadata */}
        <script type="application/ld+json">{JSON.stringify(metadata)}</script>

        <div class={styles.columnsContainer}>
          <div class={styles.column}>
            <div
              class={styles.dropZone}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleDropzoneClick}
              role="region"
              aria-label="File upload area"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                aria-label="Choose SVG files to convert"
              />
              <p>Drop SVG files here or click to upload</p>
              <div class={styles.previewContainer}>
                {Object.entries(svgContents()).map(([fileName, content]) => (
                  <div
                    class={styles.preview}
                    role="figure"
                    aria-label={`Preview of ${fileName}`}
                  >
                    <div
                      class={styles.previewIcon}
                      innerHTML={content}
                      role="img"
                      aria-label={`SVG content for ${fileName}`}
                    />
                    <span class={styles.fileName}>{fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            class={`${styles.column} ${styles.outputColumn}`}
            role="region"
            aria-label="Converted vector drawables"
          >
            {Object.entries(androidVectors()).map(([fileName, vector]) => (
              <div class={styles.vectorBlock}>
                <div class={styles.vectorHeader}>
                  <h3>{formatFileName(fileName)}</h3>
                  <div class={styles.vectorActions}>
                    <button
                      onClick={() => navigator.clipboard.writeText(vector)}
                      aria-label={`Copy vector drawable for ${fileName}`}
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([vector], { type: "text/xml" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = formatFileName(fileName);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      aria-label={`Download vector drawable for ${fileName}`}
                    >
                      Download
                    </button>
                  </div>
                </div>
                <pre
                  class={styles.codeBlock}
                  role="textbox"
                  aria-label={`Vector drawable code for ${fileName}`}
                >
                  {vector}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {Object.keys(androidVectors()).length > 0 && (
          <div
            class={`${styles.actions} ${styles.stickyActions}`}
            role="toolbar"
            aria-label="Action buttons"
          >
            <button
              onClick={() => {
                const allVectors = Object.values(androidVectors()).join("\n\n");
                navigator.clipboard.writeText(allVectors);
              }}
              aria-label="Copy all vector drawables to clipboard"
            >
              Copy All to Clipboard
            </button>
            <button
              onClick={downloadVectors}
              aria-label={
                Object.keys(androidVectors()).length > 1
                  ? "Download all vectors as ZIP"
                  : "Download vector drawable"
              }
            >
              {Object.keys(androidVectors()).length > 1
                ? "Download All as ZIP"
                : "Download Vector"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
