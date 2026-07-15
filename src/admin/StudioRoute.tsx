import { Studio, defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import './admin.css';

const projectId = (import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined) || '0we3mwlb';
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || 'production';

const studioConfig = defineConfig({
  name: 'default',
  title: 'Rohan Chintakindi — Writing',
  projectId,
  dataset,
  basePath: '/admin',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});

export default function StudioRoute() {
  return <Studio config={studioConfig} />;
}
