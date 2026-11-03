import { expect, test } from '@playwright/test';

test('a storage failure keeps the selection and allows retry without duplicate orders', async ({
  page,
}) => {
  await page.goto('/');
  const summary = page.getByRole('complementary', { name: 'Deine Pizza im Überblick' });
  await page.getByRole('radio', { name: /Glutenfreier Teig/ }).check();
  await page.getByRole('button', { name: /Groß.*36 cm/ }).click();
  await expect(summary).toContainText('16,00');

  // Simulate a browser storage quota error at the persistence boundary.
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'mamma-mia-demo-orders') {
        Storage.prototype.setItem = original;
        throw new DOMException('Test: storage quota exceeded', 'QuotaExceededError');
      }
      return original.call(this, key, value);
    };
  });
  const submit = page.getByRole('button', { name: 'Bestellung aufgeben', exact: true });
  await submit.click();
  await expect(page.getByRole('alert')).toContainText('Test: storage quota exceeded');
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByRole('checkbox', { name: /^Mozzarella/ })).toBeChecked();
  await expect(page.getByRole('radio', { name: /Glutenfreier Teig/ })).toBeChecked();
  await expect(submit).toBeEnabled();
  expect(
    await page.evaluate(() => localStorage.getItem('mamma-mia-demo-orders'))
  ).toBeNull();

  await submit.click();
  await expect(page.getByRole('status')).toContainText('16,00');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(submit).toBeDisabled();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Bestellungen', exact: true })
    .click();
  await expect(
    page.getByRole('link').filter({ hasText: 'Deine Pizza nach Wunsch' })
  ).toHaveCount(1);
});
