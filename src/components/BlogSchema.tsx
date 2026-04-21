interface BlogSchemaProps {
  title: string;
  description: string;
  slug: string;
  publishedDate: string; // ISO format: "2026-04-08"
  modifiedDate?: string;
  imageUrl?: string;
}

export function BlogSchema({ title, description, slug, publishedDate, modifiedDate, imageUrl }: BlogSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: imageUrl || "https://www.unicornds.io/logo.png",
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      "@type": "Organization",
      name: "UnicornDS",
      url: "https://www.unicornds.io",
    },
    publisher: {
      "@type": "Organization",
      name: "UnicornDS",
      logo: {
        "@type": "ImageObject",
        url: "https://www.unicornds.io/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.unicornds.io/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
