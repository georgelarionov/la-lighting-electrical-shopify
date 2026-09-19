#!/usr/bin/env node
// B2B pricing admin for this store, over `shopify store execute` (needs Node 22
// and a stored `shopify store auth`). Every command prints the resulting state.
//
//   b2b groups                                  list groups → percent
//   b2b group set <key> <pct>                   add/update a group
//   b2b group rm <key>                          remove a group
//   b2b customer <email>                        show a customer's B2B fields
//   b2b customer <email> group <key>            put the customer in a group
//   b2b customer <email> discount <pct>         personal percent (0 = remove)
//   b2b customer <email> clear                  retail again (both fields off)
//   b2b find <text>                             products matching <text>, with SKUs
//   b2b variant <sku|id>                        show a variant's B2B prices (ID for SKU-less variants)
//   b2b variant <sku> set <key|email> <price|N%>  fixed price or percent for a group / customer
//   b2b variant <sku> rm <key|email>            drop that entry
//   b2b variant <sku> clear                     drop all B2B prices on the variant
//   b2b prices                                  every variant that has B2B prices
//
// Model (see CLAUDE.md "B2B pricing"): shop custom.b2b_groups {"contractor": 25};
// customer custom.b2b_group / custom.b2b_discount; variant custom.b2b_prices
// {"contractor": 12.5, "wholesale": "30%", "<customerId>": 11}.
import {execFileSync} from 'node:child_process';

const STORE = '7c20fd-dq.myshopify.com';
const NS = 'custom';

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function gql(query, variables = {}, mutate = false) {
  const args = ['store', 'execute', '-s', STORE, '--json', '--query', query, '--variables', JSON.stringify(variables)];
  if (mutate) args.push('--allow-mutations');
  let out;
  try {
    out = execFileSync('shopify', args, {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']});
  } catch (e) {
    fail((e.stderr || e.stdout || e.message).toString().trim());
  }
  const data = JSON.parse(out);
  for (const v of Object.values(data)) {
    if (v?.userErrors?.length) fail(v.userErrors.map((u) => u.message).join('; '));
  }
  return data;
}

const MF = `metafield(namespace: "${NS}", key: "%k") { value }`;
const mf = (k) => MF.replace('%k', k);

function setMetafield(ownerId, key, type, value) {
  gql(
    `mutation($m: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $m) { metafields { key } userErrors { message } } }`,
    {m: [{ownerId, namespace: NS, key, type, value: String(value)}]},
    true,
  );
}

function deleteMetafields(ownerId, keys) {
  gql(
    `mutation($m: [MetafieldIdentifierInput!]!) { metafieldsDelete(metafields: $m) { deletedMetafields { key } userErrors { message } } }`,
    {m: keys.map((key) => ({ownerId, namespace: NS, key}))},
    true,
  );
}

const parseJson = (v) => {
  try {
    const o = JSON.parse(v ?? '');
    return o && typeof o === 'object' && !Array.isArray(o) ? o : {};
  } catch {
    return {};
  }
};

/* ---------- lookups ---------- */

function shop() {
  const d = gql(`{ shop { id groups: ${mf('b2b_groups')} } }`);
  return {id: d.shop.id, groups: parseJson(d.shop.groups?.value)};
}

function customer(email) {
  const d = gql(
    `query($q: String!) { customers(first: 2, query: $q) { nodes { id email displayName group: ${mf('b2b_group')} discount: ${mf('b2b_discount')} } } }`,
    {q: `email:${email}`},
  );
  const nodes = d.customers.nodes.filter((c) => c.email?.toLowerCase() === email.toLowerCase());
  if (nodes.length !== 1) fail(`customer ${email}: ${nodes.length ? 'ambiguous' : 'not found'}`);
  const c = nodes[0];
  return {
    id: c.id,
    num: c.id.split('/').pop(),
    email: c.email,
    name: c.displayName,
    group: c.group?.value ?? null,
    discount: c.discount?.value ? Number(c.discount.value) : null,
  };
}

const VARIANT_FIELDS = `id sku title price product { title handle } b2b: ${mf('b2b_prices')}`;

function variant(sku) {
  if (/^\d+$/.test(sku)) {
    // Variants without a SKU are addressed by the ID that `find` prints.
    const d = gql(`query($id: ID!) { productVariant(id: $id) { ${VARIANT_FIELDS} } }`, {id: `gid://shopify/ProductVariant/${sku}`});
    if (!d.productVariant) fail(`no variant with ID ${sku}`);
    return d.productVariant;
  }
  const d = gql(
    `query($q: String!) { productVariants(first: 2, query: $q) { nodes { ${VARIANT_FIELDS} } } }`,
    {q: `sku:${sku}`},
  );
  const nodes = d.productVariants.nodes.filter((v) => v.sku === sku);
  if (nodes.length !== 1) fail(`variant with SKU ${sku}: ${nodes.length ? 'ambiguous' : 'not found'} (try: b2b find <product>)`);
  return nodes[0];
}

/** A key for the variant JSON: a group key as-is, an email → the customer's numeric ID. */
function priceKey(keyOrEmail, groups) {
  if (keyOrEmail.includes('@')) return customer(keyOrEmail).num;
  if (!(keyOrEmail in groups) && !/^\d+$/.test(keyOrEmail)) {
    fail(`"${keyOrEmail}" is neither a group (${Object.keys(groups).join(', ') || 'none yet'}) nor an email / customer ID`);
  }
  return keyOrEmail;
}

const pct = (s, {integer = false} = {}) => {
  const n = Number(s);
  if (!(n >= 0 && n <= 100) || (integer && !Number.isInteger(n))) fail(`percent must be ${integer ? 'a whole number ' : ''}0-100, got "${s}"`);
  return n;
};

/* ---------- output ---------- */

const money = (n) => `$${Number(n).toFixed(2)}`;
const priceEntry = (v) => (typeof v === 'string' && v.trim().endsWith('%') ? `${v} off` : money(v));

function printGroups(groups) {
  const keys = Object.keys(groups);
  if (!keys.length) return console.log('groups: none');
  console.log('groups:');
  for (const k of keys) console.log(`  ${k}: ${groups[k]}% off`);
}

function printCustomer(c, groups) {
  console.log(`${c.email} (${c.name}, ID ${c.num})`);
  console.log(`  group:    ${c.group ? `${c.group}${c.group in groups ? ` (${groups[c.group]}% off)` : ' (NOT in B2B groups — has no effect)'}` : '—'}`);
  console.log(`  discount: ${c.discount ? `${c.discount}% off (beats the group)` : '—'}`);
}

function printVariant(v) {
  console.log(`${v.product.title} — ${v.title} [${v.sku ?? `no SKU, ID ${v.id.split('/').pop()}`}] list ${money(v.price)}`);
  const prices = parseJson(v.b2b?.value);
  const keys = Object.keys(prices);
  if (!keys.length) return console.log('  B2B prices: none');
  for (const k of keys) console.log(`  ${/^\d+$/.test(k) ? `customer ${k}` : k}: ${priceEntry(prices[k])}`);
}

/* ---------- commands ---------- */

const [cmd, ...a] = process.argv.slice(2);
const usage = () => fail(`unknown command — see the header of ${new URL(import.meta.url).pathname}`);

switch (cmd) {
  case 'groups': {
    printGroups(shop().groups);
    break;
  }
  case 'group': {
    const [op, key, value] = a;
    const s = shop();
    if (op === 'set' && key && value != null) s.groups[key] = pct(value);
    else if (op === 'rm' && key) {
      if (!(key in s.groups)) fail(`no group "${key}"`);
      delete s.groups[key];
      console.log(`note: customers still tagged "${key}" keep the key but get no group percent until moved.`);
    } else usage();
    setMetafield(s.id, 'b2b_groups', 'json', JSON.stringify(s.groups));
    printGroups(s.groups);
    break;
  }
  case 'customer': {
    const [email, op, value] = a;
    if (!email) usage();
    const c = customer(email);
    const {groups} = shop();
    if (op === 'group') {
      if (!value) usage();
      if (!(value in groups)) fail(`no group "${value}" — create it first: b2b group set ${value} <pct>`);
      setMetafield(c.id, 'b2b_group', 'single_line_text_field', value);
      c.group = value;
    } else if (op === 'discount') {
      const n = pct(value, {integer: true});
      if (n) setMetafield(c.id, 'b2b_discount', 'number_integer', n);
      else deleteMetafields(c.id, ['b2b_discount']);
      c.discount = n || null;
    } else if (op === 'clear') {
      deleteMetafields(c.id, ['b2b_group', 'b2b_discount']);
      c.group = c.discount = null;
    } else if (op) usage();
    printCustomer(c, groups);
    break;
  }
  case 'find': {
    const text = a.join(' ');
    if (!text) usage();
    const d = gql(
      `query($q: String!) { products(first: 20, query: $q) { nodes { title variants(first: 50) { nodes { ${VARIANT_FIELDS} } } } } }`,
      {q: `title:*${text}*`},
    );
    const vs = d.products.nodes.flatMap((p) => p.variants.nodes);
    if (!vs.length) console.log('no products match');
    for (const v of vs) printVariant(v);
    break;
  }
  case 'variant': {
    const [sku, op, key, value] = a;
    if (!sku) usage();
    const v = variant(sku);
    if (op) {
      const prices = parseJson(v.b2b?.value);
      if (op === 'set' && key && value != null) {
        const k = priceKey(key, shop().groups);
        if (/^\d+(\.\d+)?\s*%$/.test(value)) {
          if (!pct(parseFloat(value))) fail('percent must be above 0');
          prices[k] = value.replace(/\s+/g, '');
        } else if (Number(value) > 0) {
          prices[k] = Number(value);
          if (prices[k] >= Number(v.price)) console.log(`note: ${money(prices[k])} is not below list ${money(v.price)} — this entry gives no discount.`);
        } else fail(`price must be a number (fixed price) or "N%" (percent off), got "${value}"`);
      } else if (op === 'rm' && key) {
        const k = priceKey(key, shop().groups);
        if (!(k in prices)) fail(`no entry "${k}" on this variant`);
        delete prices[k];
      } else if (op === 'clear') {
        for (const k of Object.keys(prices)) delete prices[k];
      } else usage();
      if (Object.keys(prices).length) setMetafield(v.id, 'b2b_prices', 'json', JSON.stringify(prices));
      else deleteMetafields(v.id, ['b2b_prices']);
      v.b2b = Object.keys(prices).length ? {value: JSON.stringify(prices)} : null;
    }
    printVariant(v);
    break;
  }
  case 'prices': {
    // ponytail: 250 products × 100 variants, one call — the catalog is ~35 products.
    const d = gql(`{ products(first: 250) { nodes { variants(first: 100) { nodes { ${VARIANT_FIELDS} } } } } }`);
    const vs = d.products.nodes.flatMap((p) => p.variants.nodes).filter((v) => v.b2b?.value);
    if (!vs.length) console.log('no variant has B2B prices');
    for (const v of vs) printVariant(v);
    break;
  }
  default:
    usage();
}
