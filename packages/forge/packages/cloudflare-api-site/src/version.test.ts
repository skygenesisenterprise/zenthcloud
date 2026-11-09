import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  zenthcloud_API_VERSION_CODENAMES,
  zenthcloudApiVersionLabel,
  zenthcloudApiVersionSlug,
  zenthcloudApiVersionSortKey,
  comparezenthcloudApiVersions,
  isDated,
  isLegacy,
  isPreview,
  isStable,
  parsezenthcloudApiVersion,
  tryParsezenthcloudApiVersion,
} from './version.ts';

test('parses a dated major release', () => {
  const version = parsezenthcloudApiVersion('2027-01-01.air');
  assert.ok(version.channel === 'dated');
  assert.equal(version.codename, 'air');
  assert.equal(version.date, '2027-01-01');
  assert.deepEqual([version.year, version.month, version.day], [2027, 1, 1]);
  assert.equal(version.wire, '2027-01-01.air');
});

test('monthly minors reuse the major codename', () => {
  for (const wire of ['2027-02-01.air', '2027-03-01.air', '2027-06-01.air']) {
    const version = parsezenthcloudApiVersion(wire);
    assert.ok(version.channel === 'dated');
    assert.equal(version.codename, 'air');
    assert.equal(version.wire, wire);
  }
});

test('major boundaries advance the codename alphabetically', () => {
  const cases: Array<[string, string]> = [
    ['2027-01-01.air', 'air'],
    ['2027-07-01.breeze', 'breeze'],
    ['2028-01-01.cirrus', 'cirrus'],
    ['2028-07-01.dew', 'dew'],
  ];
  for (const [wire, codename] of cases) {
    const version = parsezenthcloudApiVersion(wire);
    assert.ok(version.channel === 'dated');
    assert.equal(version.codename, codename);
  }
});

test('every codename in the alphabet parses', () => {
  for (const codename of zenthcloud_API_VERSION_CODENAMES) {
    const version = parsezenthcloudApiVersion(`2030-01-01.${codename}`);
    assert.ok(version.channel === 'dated');
    assert.equal(version.codename, codename);
  }
});

test('parses the preview channel', () => {
  const version = parsezenthcloudApiVersion('2027-02-01.preview');
  assert.ok(version.channel === 'preview');
  assert.equal(version.date, '2027-02-01');
  assert.equal(version.wire, '2027-02-01.preview');
});

test('parses the legacy epoch', () => {
  const version = parsezenthcloudApiVersion('legacy');
  assert.ok(version.channel === 'legacy');
  assert.equal(version.wire, 'legacy');
});

test('parsing is case-insensitive and canonicalizes to lowercase', () => {
  assert.equal(parsezenthcloudApiVersion('2027-01-01.AIR').wire, '2027-01-01.air');
  assert.equal(parsezenthcloudApiVersion('  2027-02-01.Preview  ').wire, '2027-02-01.preview');
  assert.equal(parsezenthcloudApiVersion('LEGACY').wire, 'legacy');
});

test('canonical wire round-trips through the parser', () => {
  for (const input of ['legacy', '2027-01-01.air', '2027-02-01.preview', '2028-07-01.dew']) {
    const once = parsezenthcloudApiVersion(input);
    assert.equal(parsezenthcloudApiVersion(once.wire).wire, once.wire);
  }
});

test('rejects invalid versions with descriptive errors', () => {
  assert.throws(() => parsezenthcloudApiVersion('latest'), /"latest" is not a valid API version/);
  assert.throws(() => parsezenthcloudApiVersion('2027-01-01'), /expected "legacy" or "YYYY-MM-DD/);
  assert.throws(() => parsezenthcloudApiVersion('2027-13-01.air'), /not a real calendar date/);
  assert.throws(() => parsezenthcloudApiVersion('2027-02-30.air'), /not a real calendar date/);
  assert.throws(() => parsezenthcloudApiVersion('2027-01-01.foo'), /not a known codename/);
  assert.throws(() => parsezenthcloudApiVersion('2027-1-1.air'), /expected "legacy" or "YYYY-MM-DD/);
  assert.throws(() => parsezenthcloudApiVersion(''), /must not be empty/);
  assert.throws(() => parsezenthcloudApiVersion('garbage'), /expected "legacy" or "YYYY-MM-DD/);
});

test('leap-year dates are validated', () => {
  const leap = parsezenthcloudApiVersion('2028-02-29.air');
  assert.ok(leap.channel === 'dated');
  assert.equal(leap.date, '2028-02-29');
  assert.throws(() => parsezenthcloudApiVersion('2027-02-29.air'), /not a real calendar date/);
});

test('tryParse returns null on invalid input and a value on valid input', () => {
  assert.equal(tryParsezenthcloudApiVersion('nope'), null);
  assert.equal(tryParsezenthcloudApiVersion('latest'), null);
  assert.equal(tryParsezenthcloudApiVersion('2027-01-01.air')?.channel, 'dated');
});

test('compare orders legacy < dated (by date) < same-date preview', () => {
  const scrambled = [
    '2027-07-01.breeze',
    'legacy',
    '2027-02-01.preview',
    '2027-01-01.air',
    '2027-02-01.air',
    '2028-01-01.cirrus',
  ].map(parsezenthcloudApiVersion);
  const ordered = [...scrambled].sort(comparezenthcloudApiVersions).map((version) => version.wire);
  assert.deepEqual(ordered, [
    'legacy',
    '2027-01-01.air',
    '2027-02-01.air',
    '2027-02-01.preview',
    '2027-07-01.breeze',
    '2028-01-01.cirrus',
  ]);
});

test('sort keys are monotonically increasing in release order', () => {
  const keys = ['legacy', '2027-01-01.air', '2027-02-01.air', '2027-02-01.preview', '2027-07-01.breeze']
    .map(parsezenthcloudApiVersion)
    .map(zenthcloudApiVersionSortKey);
  for (let i = 1; i < keys.length; i++) {
    const previous = keys[i - 1];
    const current = keys[i];
    assert.ok(previous !== undefined && current !== undefined);
    assert.ok(current > previous, `${current} should sort after ${previous}`);
  }
});

test('predicates classify each channel', () => {
  const legacy = parsezenthcloudApiVersion('legacy');
  const dated = parsezenthcloudApiVersion('2027-01-01.air');
  const preview = parsezenthcloudApiVersion('2027-02-01.preview');
  assert.deepEqual([isLegacy(legacy), isDated(dated), isPreview(preview)], [true, true, true]);
  assert.deepEqual([isStable(legacy), isStable(dated), isStable(preview)], [true, true, false]);
});

test('labels render for display', () => {
  const label = (wire: string): string => zenthcloudApiVersionLabel(parsezenthcloudApiVersion(wire));
  assert.equal(label('legacy'), 'Legacy');
  assert.equal(label('2027-01-01.air'), '2027-01-01 (Air)');
  assert.equal(label('2027-02-01.preview'), '2027-02-01 (Preview)');
});

test('the URL slug is the bare date; the codename and preview suffix never appear', () => {
  const slug = (wire: string): string => zenthcloudApiVersionSlug(parsezenthcloudApiVersion(wire));
  assert.equal(slug('2027-01-01.air'), '2027-01-01');
  assert.equal(slug('2027-07-01.breeze'), '2027-07-01');
  // Preview collapses to its date too — "only the date" appears in the URL.
  assert.equal(slug('2028-01-01.preview'), '2028-01-01');
  // Legacy has no date, so it keeps its literal token.
  assert.equal(slug('legacy'), 'legacy');
});
