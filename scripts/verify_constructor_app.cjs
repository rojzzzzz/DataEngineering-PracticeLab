// Read-only tool navigation plus a disposable Mock Data preview in the live app.
const { chromium, browserOptions } = require("./browser_runtime.cjs");
(async () => {
  const browser = await chromium.launch(browserOptions);
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    page.setDefaultTimeout(30000);
    await page.goto("http://localhost:8501");
    await page.getByText("Constructor Mode", { exact: true }).click();
    for (const tool of [
      "Diagram Maker",
      "SQL Playground & Formatter",
      "Mock Data Generator",
      "Pipeline Designer",
    ]) {
      await page
        .getByRole("button", { name: `Open ${tool}`, exact: true })
        .click();
      if (tool === "Diagram Maker") {
        await page
          .getByRole("button", { name: "New diagram", exact: true })
          .waitFor();
      }
      if (tool === "SQL Playground & Formatter") {
        await page
          .getByRole("tab", { name: "Explain Plan", exact: true })
          .click();
        await page
          .getByRole("button", {
            name: "Load ANALYZE example (replaces input)",
            exact: true,
          })
          .click();
        await page
          .getByRole("button", { name: "Inspect plan", exact: true })
          .click();
        await page
          .locator(".sut-plan-overview")
          .getByText("38.6 ms", { exact: true })
          .waitFor();
      }
      if (tool === "Mock Data Generator") {
        await page
          .getByRole("button", { name: "Preview 50 rows", exact: true })
          .click();
        await page
          .getByText(/Preview ready · 50 rows/)
          .waitFor({ timeout: 60000 });
      }
      if (tool === "Pipeline Designer") {
        await page
          .locator(".pipeline-root")
          .getByText("New project name", { exact: true })
          .waitFor();
      }
      await page
        .getByRole("button", { name: "Back to tools", exact: true })
        .click();
    }
    await page
      .getByRole("button", { name: "Open Mock Data Generator", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Generate data", exact: true })
      .waitFor();
    if (await page.getByText(/Preview ready/).count())
      throw new Error("Preview leaked across closed workspace");
    await page
      .getByRole("button", { name: "Back to tools", exact: true })
      .click();
    console.log(
      "Live Constructor: all four tools open, EXPLAIN works, Mock preview completes and is cleaned on navigation, Pipeline frontend initializes.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
