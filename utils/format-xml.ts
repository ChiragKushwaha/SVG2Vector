const formatXML = (xml: string): string => {
  // Handle empty or invalid input
  if (!xml || typeof xml !== "string") {
    return "";
  }

  // First, clean up the input XML
  const cleanXml = xml.replace(/>\s+</g, "><").replace(/\r?\n/g, "").trim();

  let formatted = "";
  let indent = "";
  const tab = "    "; // 4 spaces for indentation

  // Handle XML declaration and CDATA sections
  const tokens = cleanXml
    .split(/(<!\[CDATA\[.*?\]\]>|<[^>]+>)/g)
    .filter((token) => token.trim());

  tokens.forEach((token) => {
    // Handle CDATA sections
    if (token.includes("CDATA")) {
      formatted += indent + token + "\n";
      return;
    }

    // Handle comments
    if (token.startsWith("<!--")) {
      formatted += indent + token + "\n";
      return;
    }

    // Handle self-closing tags
    if (token.match(/<[^>]+\/>/)) {
      formatted += indent + token + "\n";
      return;
    }

    // Handle closing tags
    if (token.startsWith("</")) {
      indent = indent.substring(tab.length);
      formatted += indent + token + "\n";
      return;
    }

    // Handle opening tags
    if (token.startsWith("<")) {
      formatted += indent + token + "\n";
      indent += tab;
      return;
    }

    // Handle text content
    formatted += indent + token.trim() + "\n";
  });

  return formatted.trim();
};

export default formatXML;
