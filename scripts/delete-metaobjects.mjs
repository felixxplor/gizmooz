#!/usr/bin/env node
import {readFileSync} from 'fs';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '../.env'), 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);

const SHOP = env.PUBLIC_STORE_DOMAIN;
const CLIENT_ID = env.SHOPIFY_API_KEY;
const CLIENT_SECRET = env.SHOPIFY_API_SECRET;

const tokenRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials'}),
});
const {access_token} = await tokenRes.json();

const idsToDelete = [
  // drafts from run 1
  'gid://shopify/Metaobject/159679971411',
  'gid://shopify/Metaobject/159680004179',
  'gid://shopify/Metaobject/159680036947',
  'gid://shopify/Metaobject/159680069715',
  'gid://shopify/Metaobject/159680102483',
  // duplicates from run 3
  'gid://shopify/Metaobject/159680364627',
  'gid://shopify/Metaobject/159680397395',
  'gid://shopify/Metaobject/159680430163',
  'gid://shopify/Metaobject/159680462931',
  'gid://shopify/Metaobject/159680495699',
];

for (const id of idsToDelete) {
  const res = await fetch(`https://${SHOP}/admin/api/2026-01/graphql.json`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token},
    body: JSON.stringify({
      query: `mutation { metaobjectDelete(id: "${id}") { deletedId userErrors { message } } }`,
    }),
  });
  const json = await res.json();
  const errors = json?.data?.metaobjectDelete?.userErrors ?? [];
  if (errors.length) console.error('✗', id, errors);
  else console.log('✓ deleted', id);
  await new Promise((r) => setTimeout(r, 100));
}
