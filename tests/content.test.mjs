import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { copy, projects } from '../src/content/portfolio.js';
import { planets } from '../src/content/planets.js';
import { messages } from '../src/content/translations.js';

test('all eight existing projects retain bilingual descriptions and local artwork', () => {
  assert.deepEqual(projects.map(p => p.id), ['vibot','nebu','1d-anomali','3d-anomali','yuz-kirpma','foto-siniflandirma','turkiye-harita','resumematch-ai']);
  for (const project of projects) {
    assert.ok(existsSync(new URL(`../public${project.image}`, import.meta.url)));
    for (const language of ['tr', 'en']) {
      for (const key of ['title', 'summary', 'purpose']) assert.ok(project[language][key]?.length > 0);
      assert.ok(project[language].highlights.length > 0);
      assert.ok(project[language].tags.length > 0);
    }
    for (const link of Object.values(project.links || {})) assert.equal(new URL(link).protocol, 'https:');
  }
});
test('planet configuration maps existing sections exactly, plus the classic fallback', () => {
  assert.equal(planets.length, 6);
  assert.equal(new Set(planets.map(p => p.route)).size, 6);
  assert.equal(new Set(planets.map(p => p.type)).size, 6);
  for (const language of ['tr', 'en']) {
    assert.deepEqual(planets.filter(p => p.id !== 'classic').map(p => p.key), Object.keys(copy[language].nav));
    for (const planet of planets) {
      assert.ok(messages[language].subtitles[planet.id]);
      assert.ok(planet.x > 0 && planet.x < 100 && planet.y > 0 && planet.y < 100);
    }
  }
  assert.equal(planets.find(p => p.id === 'classic').route, '/classic');
});
test('TR and EN interface dictionaries have identical shapes', () => {
  const keys = object => Object.entries(object).flatMap(([key, value]) => typeof value === 'object' ? keys(value).map(child => `${key}.${child}`) : [key]).sort();
  assert.deepEqual(keys(messages.tr), keys(messages.en));
  assert.deepEqual(keys(copy.tr), keys(copy.en));
});
test('original professional experience and contact channels are present', () => {
  assert.equal(copy.en.journey.items.length, 3);
  assert.equal(copy.tr.journey.items.length, 3);
  assert.equal(copy.en.about.chapters.length, 4);
  assert.equal(copy.en.contact.email, 'yyavuzsarac@gmail.com');
  assert.equal(copy.tr.contact.linkedin, 'linkedin.com/in/myavuzsarac');
});
