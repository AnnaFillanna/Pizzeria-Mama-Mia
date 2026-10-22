import { expect, test } from '@playwright/test';

test('German account forms and empty order history on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/register');
  await page.getByLabel('Name', { exact: true }).fill('Pizza Fan');
  await page.getByLabel('E-mail', { exact: true }).fill('pizza@example.com');
  await page.getByLabel('Passwort', { exact: true }).fill('example-only');
  await page.getByRole('button', { name: 'Passwort anzeigen' }).click();
  await expect(page.getByLabel('Passwort', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Konto erstellen', exact: true }).click();
  await page.goto('/#/profile');
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Pizza Fan');
  await page.getByLabel('Name', { exact: true }).fill('Mamma Mia Fan');
  await page.getByRole('button', { name: 'Speichern', exact: true }).click();
  await page.reload();
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Mamma Mia Fan');
  await page.goto('/#/profile/orders');
  await expect(page.getByRole('heading', { name: 'Noch keine Bestellungen' })).toBeVisible();
  await expect(page.getByLabel('Hinweis zur Demo-Version')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('order history uses euros, German dates and light cards', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Bestellung aufgeben', exact: true }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Bestellungen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Bestellungen', exact: true })).toBeVisible();
  const card = page.getByRole('link').filter({ hasText: 'Deine Pizza nach Wunsch' });
  await expect(card).toContainText('13,00');
  await expect(card).toContainText('€');
  await expect(card).toHaveCSS('background-color', 'rgb(255, 253, 248)');
  await expect(page.locator('body')).not.toContainText(/Сегодня|Пароль/);
  await card.click();
  await expect(page.getByText('Bestelldetails', { exact: true })).toBeVisible();
});
