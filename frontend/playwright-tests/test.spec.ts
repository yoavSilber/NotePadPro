import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Guest access', () => {
  test('Guest sees homepage and navigation buttons', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.getByTestId('go_to_login_button')).toBeVisible();
    await expect(page.getByTestId('go_to_create_user_button')).toBeVisible();
  });

  test('Guest cannot see "Add Note" button', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('button[name="add_new_note"]')).toHaveCount(0);
  });
});

test.describe('User registration and login flow', () => {
  const uniqueId = Date.now();
  const testUser = {
    name: 'Test User',
    email: `test${uniqueId}@example.com`,
    username: `testuser${uniqueId}`,
    password: 'secret123',
  };

  test('User can create a new account', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByTestId('go_to_create_user_button').click();

    await expect(page).toHaveURL(/\/create-user/);

    await page.getByTestId('create_user_form_name').fill(testUser.name);
    await page.getByTestId('create_user_form_email').fill(testUser.email);
    await page.getByTestId('create_user_form_username').fill(testUser.username);
    await page.getByTestId('create_user_form_password').fill(testUser.password);

    await Promise.all([
      page.waitForURL(BASE_URL + '/'),
      page.getByTestId('create_user_form_create_user').click(),
    ]);

    await expect(page.getByTestId('go_to_login_button')).toBeVisible();
  });

  test('User can login and see add note/logout buttons', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByTestId('go_to_login_button').click();
    await expect(page).toHaveURL(/\/login/);

    await page.getByTestId('login_form_username').fill(testUser.username);
    await page.getByTestId('login_form_password').fill(testUser.password);

    await Promise.all([
      page.waitForURL(BASE_URL + '/'),
      page.getByTestId('login_form_login').click(),
    ]);

    await expect(page.getByTestId('logout')).toBeVisible();
    await expect(page.locator('button[name="add_new_note"]')).toBeVisible();
  });

  test('Logout makes add note button disappear', async ({ page }) => {
    // Login first
    await page.goto(BASE_URL);
    await page.getByTestId('go_to_login_button').click();
    await expect(page).toHaveURL(/\/login/);

    await page.getByTestId('login_form_username').fill(testUser.username);
    await page.getByTestId('login_form_password').fill(testUser.password);

    await Promise.all([
      page.waitForURL(BASE_URL + '/'),
      page.getByTestId('login_form_login').click(),
    ]);

    // Now log out
    const logoutBtn = page.getByTestId('logout');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    await expect(page.getByTestId('go_to_login_button')).toBeVisible();
    await expect(page.locator('button[name="add_new_note"]')).toHaveCount(0);
  });
});
