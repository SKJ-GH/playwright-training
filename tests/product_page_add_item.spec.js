import { test, expect } from "@playwright/test"

test.skip("Product Page Add To Basket", async ({ page }) => {

    await page.goto("/")
    // await page.pause()

    // locator('div').filter({ hasText: /^499\$Add to Basket$/ }).getByRole('button')
    // page.getByRole('button', { name: 'Add to Basket' }).first()
    // console.log(await page.getByRole('button', { name: 'Add to Basket' }).count())

    const addToBasketButton = page.locator('[data-qa="product-button"]').first()
    const basketCounter = page.locator('[data-qa="header-basket-count"]')

    // Verify that the text changed from "Add to Basket" to "Remove from Basket" on click of first button
    // Verify that the basket counter increased from 0 to 1 on clcik of the first button
    await addToBasketButton.waitFor()
    await expect(addToBasketButton).toHaveText("Add to Basket")
    await expect(basketCounter).toHaveText("0")
    await addToBasketButton.click()
    await expect(addToBasketButton).toHaveText("Remove from Basket")
    await expect(basketCounter).toHaveText("1")

    const checkoutLink = page.getByRole('link', { name: 'Checkout' })
    await checkoutLink.waitFor()
    await checkoutLink.click()
    await page.waitForURL("/basket")

})

