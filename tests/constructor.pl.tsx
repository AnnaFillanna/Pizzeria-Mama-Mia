import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('builds a pizza and saves a local demo order', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Werde Pizzaiolo' })).toBeVisible();

  const glutenFreeDough = page.getByRole('radio', { name: /Glutenfreier Teig/ });
  await glutenFreeDough.check();
  await expect(glutenFreeDough).toBeChecked();

  const largeSize = page.getByRole('button', { name: /Groß.*36 cm/ });
  await largeSize.click();
  await expect(largeSize).toHaveAttribute('aria-pressed', 'true');

  const anchovies = page.getByRole('checkbox', { name: /Sardellen/ });
  await anchovies.check();
  await expect(anchovies).toBeChecked();

  await page.getByRole('button', { name: 'Demo-Bestellung aufgeben' }).click();
  await expect(page.getByRole('status')).toContainText('Grazie');

  const orders = await page.evaluate(() =>
    localStorage.getItem('mamma-mia-demo-orders')
  );
  expect(orders).toContain('"doughId":"dough-glutenfree"');
  expect(orders).toContain('"size":"large"');
  expect(orders).toContain('"fish-anchovy"');
  expect(orders?.match(/"_id"/g)).toHaveLength(1);
});

test('menu pizza presets update the configurable toppings', async ({ page }) => {
  await page
    .getByRole('button', { name: /Auswählen/ })
    .nth(2)
    .click();

  await expect(page.getByRole('checkbox', { name: /Steinpilze/ })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: /Kirschtomaten/ })).not.toBeChecked();
});
