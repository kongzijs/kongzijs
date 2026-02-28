import { test, expect } from "@playwright/test";

test.describe("LessonBuilder E2E Flow", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should render the initial state correctly", async ({ page }) => {
        await expect(page.getByText("Lesson Structure")).toBeVisible();
        await expect(page.getByText("Lesson Configuration")).toBeVisible();
        // Default view is Lesson Configuration (Settings)
        await expect(page.getByText("Global Settings")).toBeVisible();
    });

    test("should allow adding a new Learn node", async ({ page }) => {
        // Click "New Learn Chapter..." (Book Icon)
        await page.getByTitle("Add Learn Chapter").click();

        // Verify a new node is added
        await expect(page.getByText("New Learn Chapter")).toBeVisible();
        // Use a more specific locator for the chapter type label
        await expect(
            page.locator(".text-\\[10px\\]").getByText("LEARN CHAPTER"),
        ).toBeVisible();
    });

    test("should allow editing chapter title and saving", async ({ page }) => {
        // Add a Learn Chapter first
        await page.getByTitle("Add Learn Chapter").click();

        // Edit Title
        const titleInput = page.getByPlaceholder("未命名章节 (Enter title...)");
        await titleInput.fill("E2E Test Chapter");

        // Verify sidebar updates
        await expect(page.getByText("E2E Test Chapter")).toBeVisible();

        // Click Save
        await page.getByText("保存 (Save)").first().click();

        // Verify Floating JSON Output (Demo App Feature)
        await expect(page.getByText("💾 Saved Manifest (FLF)")).toBeVisible();
        await expect(page.locator("pre")).toContainText("E2E Test Chapter");
    });

    test("should allow adding a Quiz node and editing questions", async ({
        page,
    }) => {
        // Click "Add Test Chapter" (Zap Icon)
        await page.getByTitle("Add Test Chapter").click();

        // Verify Quiz Chapter Added - Check Sidebar specifically
        await expect(
            page
                .locator(".group.flex.items-center.gap-3")
                .getByText("New Quiz Chapter"),
        ).toBeVisible();
        // Check for specific indicator
        await expect(
            page.locator(".text-\\[10px\\]").getByText("TEST CHAPTER"),
        ).toBeVisible();

        // Check if Quiz Editor is present (looking for common text in default question)
        await expect(page.getByText("New Question")).toBeVisible();
        await expect(page.getByText("Option 1")).toBeVisible();
    });

    test("should allow modifying markdown content", async ({ page }) => {
        await page.getByTitle("Add Learn Chapter").click();

        // Wait for textarea/editor to be ready
        const editor = page.locator("textarea"); // Assuming textarea for simple markdown
        await expect(editor).toBeVisible();

        await editor.fill("# Hello E2E World");

        // Save
        await page.getByText("保存 (Save)").first().click();

        // Verify Content Persistence in JSON
        await expect(page.locator("pre")).toContainText("# Hello E2E World");
    });

    test("should allow modifying performance rules", async ({ page }) => {
        // Must use Test Chapter to see "Passing Score"
        await page.getByTitle("Add Test Chapter").click();

        // Wait for the main content to switch to the Test Chapter view
        await expect(
            page.locator(".text-\\[10px\\]").getByText("TEST CHAPTER"),
        ).toBeVisible();

        // Find Passing Score Input (now has aria-label)
        const scoreInput = page.getByLabel("Passing Score");
        await expect(scoreInput).toBeVisible();
        await scoreInput.fill("95");

        // Toggle Milestone
        const milestoneToggle = page.getByRole("switch"); // Assuming switch role
        if ((await milestoneToggle.isChecked()) === false) {
            await milestoneToggle.click();
        }

        // Save
        await page.getByText("保存 (Save)").first().click();

        // Verify JSON
        await expect(page.locator("pre")).toContainText(
            '"passing_score": 0.95',
        ); // 95% -> 0.95
        await expect(page.locator("pre")).toContainText('"is_milestone": true');
    });

    // Note: Reorder and Delete might be flaky in pure E2E without DnD support or specific delete buttons easily reachable.
    // Adding Delete test:
    test("should allow deleting a chapter", async ({ page }) => {
        await page.getByTitle("Add Learn Chapter").click();
        await expect(page.getByText("New Learn Chapter")).toBeVisible();

        // Hover over the item to show delete button (group-hover logic)
        const sidebarItem = page
            .locator(".group.flex.items-center.gap-3")
            .first();
        await sidebarItem.hover();

        // Click delete button using new aria-label
        const deleteBtn = page.getByLabel("Delete Chapter").first();
        await deleteBtn.click({ force: true }); // Force click as it might be transitioning

        // Verify it's gone
        await expect(page.getByText("New Learn Chapter")).not.toBeVisible();
    });
});
