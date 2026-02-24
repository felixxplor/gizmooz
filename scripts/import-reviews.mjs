#!/usr/bin/env node
/**
 * Bulk import reviews from scripts/reviews.csv into Shopify metaobjects.
 *
 * Usage:
 *   node scripts/import-reviews.mjs
 *
 * Edit scripts/reviews.csv to add your reviews first.
 * Columns: rating, author, title, body, date, verified
 */

import {readFileSync} from 'fs';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env manually ──────────────────────────────────────────────────────
const envPath = resolve(__dirname, '../.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const SHOP_DOMAIN = env.PUBLIC_STORE_DOMAIN;
const CLIENT_ID = env.SHOPIFY_API_KEY;
const CLIENT_SECRET = env.SHOPIFY_API_SECRET;

if (!SHOP_DOMAIN || !CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing SHOPIFY_API_KEY, SHOPIFY_API_SECRET, or PUBLIC_STORE_DOMAIN in .env');
  process.exit(1);
}

// ── Parse CSV ───────────────────────────────────────────────────────────────
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    // Handle quoted fields containing commas
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i] ?? '']));
  });
}

// ── Get admin token ──────────────────────────────────────────────────────────
async function getAdminToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status} ${await res.text()}`);
  const {access_token} = await res.json();
  return access_token;
}

// ── Create metaobject ────────────────────────────────────────────────────────
const CREATE_MUTATION = `
  mutation MetaobjectCreate($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject { id handle }
      userErrors { field message }
    }
  }
`;

async function createReview(token, review) {
  const res = await fetch(
    `https://${SHOP_DOMAIN}/admin/api/2026-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        query: CREATE_MUTATION,
        variables: {
          metaobject: {
            type: 'customer_review',
            capabilities: {publishable: {status: 'ACTIVE'}},
            fields: [
              {key: 'rating', value: review.rating},
              {key: 'author', value: review.author},
              {key: 'title', value: review.title},
              {key: 'body', value: review.body},
              {key: 'date', value: review.date},
              {key: 'verified', value: review.verified || 'false'},
            ],
          },
        },
      }),
    },
  );

  const json = await res.json();
  const errors = json?.data?.metaobjectCreate?.userErrors ?? [];
  if (!res.ok || json?.errors?.length || errors.length) {
    throw new Error(JSON.stringify(json?.errors ?? errors));
  }
  return json.data.metaobjectCreate.metaobject;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const csvPath = resolve(__dirname, 'reviews.csv');
  const reviews = parseCSV(readFileSync(csvPath, 'utf8'));
  console.log(`Found ${reviews.length} reviews to import\n`);

  const token = await getAdminToken();
  console.log('Authenticated ✓\n');

  let ok = 0;
  let fail = 0;

  for (const review of reviews) {
    try {
      const obj = await createReview(token, review);
      console.log(`✓ ${review.author} (${review.rating}★) → ${obj.id}`);
      ok++;
    } catch (e) {
      console.error(`✗ ${review.author}: ${e.message}`);
      fail++;
    }
    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone: ${ok} imported, ${fail} failed`);
  console.log('\nNow link the new metaobjects to products in Shopify admin → Content → Metaobjects');
}

main().catch(console.error);
