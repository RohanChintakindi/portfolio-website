import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';

export interface SanityImage {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  alt?: string;
  caption?: string;
  hotspot?: unknown;
  crop?: unknown;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags?: string[];
  mainImage?: SanityImage;
  body: PortableTextBlock[];
}

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || 'production';

const client = projectId ? createClient({
  projectId,
  dataset,
  apiVersion: '2026-07-15',
  useCdn: true,
}) : null;

const imageBuilder = client ? imageUrlBuilder(client) : null;

const postsQuery = `*[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  tags,
  mainImage,
  body
}`;

export async function fetchPosts(): Promise<BlogPost[]> {
  if (!client) return [];
  return client.fetch<BlogPost[]>(postsQuery);
}

export function getImageUrl(source: SanityImage, width: number): string {
  if (!imageBuilder || !source.asset) return '';
  return imageBuilder.image(source).width(width).auto('format').fit('max').url();
}
