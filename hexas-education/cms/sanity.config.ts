import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schema';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset) throw new Error('Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET in cms/.env.local.');
export default defineConfig({ name: 'hexas', title: "HEXA’S Education", projectId, dataset, plugins: [structureTool()], schema: { types: schemaTypes } });
