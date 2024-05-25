import { expect } from "@playwright/test"
import { Navigation } from "./Navigation.js"
import { isDesktopViewport } from "../utils/isDesktopViewport.js"

export class ProductsPage {

    constructor (page) {
        this.page = page

        this.addButtons = page.locator('[data-qa="product-button"]')
        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]')
        this.productTitle = page.locator('[data-qa="product-title"]')
    }

    visit = async () => {
        await this.page.goto("/")
    }

    addProductToBasket = async (index) => {
        const specificAddButton = this.addButtons.nth(index)
        await specificAddButton.waitFor()
        await expect(specificAddButton).toHaveText("Add to Basket")
        const navigation = new Navigation(this.page)
        // Only desktop viewport
        let basketCountBeforeAdding // undefined
        if (isDesktopViewport(this.page)) {
            basketCountBeforeAdding = await navigation.getBasketCount()
        }
        await specificAddButton.click()
        await expect(specificAddButton).toHaveText("Remove from Basket")
        // Only desktop viewport
        if (isDesktopViewport(this.page)) {
            const basketCountAfterAdding = await navigation.getBasketCount()
            expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding)
        }
    }

    sortByCheapest = async () => {
        await this.sortDropdown.waitFor()
        // get order of products
        await this.productTitle.first().waitFor()
        const productTitlesBeforeSorting = await this.productTitle.allInnerTexts()
        // change the sort order to Ascending
        await this.sortDropdown.selectOption("price-asc")
        // get order of products
        const productTitlesAfterSorting = await this.productTitle.allInnerTexts()
        // expect that these lists are different
        expect(productTitlesAfterSorting).not.toEqual(productTitlesBeforeSorting)
    }
}