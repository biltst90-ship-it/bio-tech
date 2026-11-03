import React from "react";

// List of biological scientific names (genus, species, varieties) to italicize
const SCIENTIFIC_TERMS = [
  "Bacillus thuringiensis var. israelensis",
  "Bacillus thuringiensis var. kurstaki",
  "Bacillus sphaericus",
  "Verticillium lecanii",
  "Metarhizium anisopliae",
  "Beauveria bassiana",
  "Helicoverpa armigera",
  "Spodoptera litura",
  "Azospirillum spp.",
  "Azospirillum spp",
  "Bacillus megaterium var. phosphaticum",
  "Frateuria aurantia",
  "Frateuria aurentia",
  "Azotobacter spp",
  "Rhizobium spp",
  "Thiobacillus thiooxidans",
  "Thiobacillus thioxidans",
  "Bacillus spp.",
  "Bacillus spp",
  "Acetobacter spp",
  "Trichoderma harzianum",
  "Trichoderma viride",
  "Pseudomonas fluorescens",
  "Bacillus subtilis",
  "Ampelomyces quisqualis",
  "Paecilomyces lilacinus",
  "Azadirachta indica",
  "Hirsutella thompsonii",
  "Pongamia glabra",
  "Millettia pinnata",
].sort((a, b) => b.length - a.length);

/**
 * Parses scientific names and renders only the exact scientific terms in italics,
 * keeping prefixes, suffixes, strains, numbers, and regular English words in normal upright font.
 */
export function ScientificName({ text }: { text?: string | null }): React.ReactElement | null {
  if (!text) return null;

  // Build regex matching any of the scientific terms (case-insensitive)
  const regex = new RegExp(`(${SCIENTIFIC_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const isScientific = SCIENTIFIC_TERMS.some(
          (term) => term.toLowerCase() === part.toLowerCase()
        );

        if (isScientific) {
          return (
            <span key={index} className="italic font-serif">
              {part}
            </span>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

/**
 * Returns HTML string with <i> tags around only scientific names (useful for print windows).
 */
export function getScientificNameHtml(text?: string | null): string {
  if (!text) return "";

  const regex = new RegExp(`(${SCIENTIFIC_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.replace(regex, "<i>$1</i>");
}

