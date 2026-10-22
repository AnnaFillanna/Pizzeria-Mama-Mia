import { expect, test } from '@playwright/test';

test('guest orders survive reload, stay isolated, and never leave the browser', async ({
  page,
  context,
}) => {
  const writes: string[] = [];
  page.on('request', (request) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method()))
      writes.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/login');
  await page.getByRole('button', { name: 'Als Demo-Gast testen' }).click();
  await expect(page.getByRole('heading', { name: 'Werde Pizzaiolo' })).toBeVisible();
  await page.getByRole('checkbox', { name: /Sardellen/ }).check();
  await page.getByRole('checkbox', { name: /Sardellen/ }).uncheck();
  await page.getByRole('checkbox', { name: /Garnelen/ }).check();
  await page.getByRole('button', { name: 'Bestellung aufgeben', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Grazie');
  await page.goto('/#/profile');
  await page.reload();
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Demo-Gast');
  await expect(page.getByLabel('Name', { exact: true })).toBeDisabled();
  await expect(page.getByLabel('E-mail', { exact: true })).toBeDisabled();
  await expect(
    page.getByLabel('Passwort (wird nicht gespeichert)', { exact: true })
  ).toBeDisabled();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
  ).toBe(true);
  await page.goto('/#/profile/orders');
  await expect(
    page.getByRole('link').filter({ hasText: 'Deine Pizza nach Wunsch' })
  ).toHaveCount(1);

  // Even another tab of the same browser has an independent writable session.
  const second = await context.newPage();
  await second.goto('/#/login');
  await second.getByRole('button', { name: 'Als Demo-Gast testen' }).click();
  await second.goto('/#/profile/orders');
  await expect(
    second.getByRole('heading', { name: 'Noch keine Bestellungen' })
  ).toBeVisible();
  await second.close();
  await page.getByRole('button', { name: /Abmelden/ }).click();
  await page.goto('/#/login');
  await page.getByRole('button', { name: 'Als Demo-Gast testen' }).click();
  await page.goto('/#/profile/orders');
  await expect(
    page.getByRole('heading', { name: 'Noch keine Bestellungen' })
  ).toBeVisible();
  expect(writes).toEqual([]);
});
