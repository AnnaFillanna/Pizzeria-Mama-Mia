import { expect, test } from '@playwright/test';

test('selection changes, recipe cards and saved orders use the same prices', async ({
  page,
}) => {
  await page.goto('/');
  const summary = page.getByRole('complementary', { name: 'Deine Pizza im Überblick' });
  const total = summary.locator('strong').last();
  await expect(total).toHaveText(/13,00/);
  await expect(summary).toContainText('8,00');
  await page.getByRole('button', { name: /Klein.*24 cm/ }).click();
  await expect(total).toHaveText(/10,00/);
  await page.getByRole('radio', { name: /Vollkornteig/ }).check();
  await expect(total).toHaveText(/11,00/);
  await page.getByRole('button', { name: /Groß.*36 cm/ }).click();
  await expect(total).toHaveText(/15,00/);
  await page.getByRole('radio', { name: /Glutenfreier Teig/ }).check();
  await expect(total).toHaveText(/16,00/);
  await page.getByRole('checkbox', { name: /^Kirschtomaten/ }).uncheck();
  await expect(total).toHaveText(/14,50/);
  const bosco = page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: 'Bosco' }) });
  await expect(bosco).toContainText('17,00');
  await bosco.getByRole('button', { name: /Auswählen/ }).click();
  await expect(total).toHaveText(/17,00/);
  await expect(page.getByRole('radio', { name: /Glutenfreier Teig/ })).toBeChecked();
  await bosco.getByRole('button', { name: /Auswählen/ }).click();
  await expect(total).toHaveText(/17,00/);
  await page.getByRole('button', { name: 'Bestellung aufgeben', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('17,00');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Bestellungen', exact: true })
    .click();
  const card = page.getByRole('link').filter({ hasText: 'Deine Pizza nach Wunsch' });
  await expect(card).toContainText('17,00');
  await card.click();
  await expect(page.getByText('Groß (36 cm) · Grundpreis')).toBeVisible();
  await expect(page.locator('#modals').getByText('17,00 €', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator('#modals').getByText('17,00 €', { exact: true })).toBeVisible();
});
