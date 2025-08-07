from playwright.sync_api import sync_playwright, Page, expect
import os

def run_verification(page: Page):
    """
    Navigates to the Svelte farm game, interacts with it, and takes screenshots.
    """
    # 1. Navigate to the game page.
    page.goto("http://localhost:5173", timeout=60000)

    # 2. Wait for the initial UI to be populated.
    # We expect the Weather component to be visible.
    weather_locator = page.locator(".weather-display")
    expect(weather_locator).to_be_visible(timeout=10000)

    day_locator = page.locator("p", has_text="Dia: 1")
    expect(day_locator).to_be_visible()

    # 3. Take a screenshot of the initial state.
    page.screenshot(path="jules-scratch/verification/svelte_initial_state.png")
    print("Took initial Svelte screenshot.")

    # 4. Click the "Next Day" button.
    next_day_button = page.get_by_role("button", name="Próximo Dia")
    next_day_button.click()

    # 5. Wait for the day to update to "2".
    day_2_locator = page.locator("p", has_text="Dia: 2")
    expect(day_2_locator).to_be_visible()

    # Also check that the notification appeared and disappeared
    notification_locator = page.locator(".notification")
    expect(notification_locator).to_be_visible()
    print("Notification is visible.")
    expect(notification_locator).to_be_hidden(timeout=5000) # Wait for it to disappear
    print("Notification has disappeared.")


    # 6. Take the final screenshot for verification.
    screenshot_path = "jules-scratch/verification/verification.png"
    page.screenshot(path=screenshot_path)
    print(f"Took final verification screenshot at {screenshot_path}")


def main():
    os.makedirs("jules-scratch/verification", exist_ok=True)

    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            run_verification(page)
            browser.close()
            print("Playwright script executed successfully.")
        except Exception as e:
            print(f"An error occurred during Playwright execution: {e}")
            if "Timeout" in str(e):
                print("A timeout occurred. The dev server is likely not running on http://localhost:5173.")

if __name__ == "__main__":
    main()
