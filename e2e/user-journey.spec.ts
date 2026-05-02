// e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test';

test('Happy Path: User can search, sort, and view details', async ({ page }) => {
  // 1. Go to the users list
  await page.goto('http://localhost:3000/users');

  // 2. Verify the page loaded
  await expect(page.locator('h1')).toContainText('Users Directory');

  // 3. Test the search filter
  const searchInput = page.getByPlaceholder('Search by name or email...');
  await searchInput.fill('Chelsey');
  
  // 4. Click on the filtered user (using .first() to handle the responsive duplicates)
  await page.getByText('Chelsey Dietrich').first().click();

  // 5. Verify we navigated to the details page
  await expect(page).toHaveURL(/.*\/users\/\d+/);
  await expect(page.locator('.text-3xl')).toContainText('Chelsey Dietrich');

  // 6. Verify tabs are working
  await page.getByRole('tab', { name: /Published Posts/i }).click();
  await expect(page.getByRole('tabpanel')).toBeVisible();

  // 7. Test the custom Back button
  await page.getByRole('button', { name: /Back to list/i }).click();
  await expect(page).toHaveURL(/.*\/users/);
});