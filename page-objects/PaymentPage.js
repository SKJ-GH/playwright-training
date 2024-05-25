import { expect } from '@playwright/test'

export class PaymentPage {

    constructor(page) {
        this.page = page

        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]').locator('[data-qa="discount-code"]')
        this.discountInput = page.getByPlaceholder('Discount code')
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.totalValue = page.locator('[data-qa="total-value"]')
        this.discountedValue = page.locator('[data-qa="total-with-discount-value"]')
        this.discountActiveMessage = page.locator('[data-qa="discount-active-message"]')
        this.creditCardOwnerInput = page.getByPlaceholder('Credit card owner')
        this.creditCardNumberInput = page.getByPlaceholder('Credit card number')
        this.creditCardValidUntilInput = page.getByPlaceholder('Valid until')
        this.creditCardCvcInput = page.getByPlaceholder('Credit card CVC')
        this.payButton = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async () => {
        // Option 1 for laggy inputs: using .fill() with await expect()
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountInput.waitFor()
        await this.discountInput.fill(code)
        await expect(await this.discountInput).toHaveValue(code)

        expect(await this.discountActiveMessage.isVisible()).toBe(false)
        expect(await this.discountedValue.isVisible()).toBe(false)
        await this.activateDiscountButton.waitFor()
        await this.activateDiscountButton.click()

        // check that it displays "Discount acivated!"
        await this.discountActiveMessage.waitFor()
        expect(await this.discountActiveMessage.innerText()).toBe("Discount activated!")
        // check that there is now a discounted total price shown
        await this.discountedValue.waitFor()
        // check that the discounted total prices is smaller than the regular one
        const totalValue = parseInt(await this.totalValue.innerText(), 10)
        const discountValue = parseInt(await this.discountedValue.innerText(), 10)
        expect(discountValue).toBeLessThan(totalValue)
    }

    activateDiscountKeyboard = async () => {
        // Option 2 for laggy inputs: slow typing
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountInput.waitFor()
        await this.discountInput.focus()
        await this.page.keyboard.type(code, {delay: 1000})
        expect(await this.discountInput.inputValue()).toBe(code)
    }

    fillPaymentDetails = async (paymentDetails) => {
        await this.creditCardOwnerInput.waitFor()
        await this.creditCardOwnerInput.fill(paymentDetails.owner)

        await this.creditCardNumberInput.waitFor()
        await this.creditCardNumberInput.fill(paymentDetails.number)

        await this.creditCardValidUntilInput.waitFor()
        await this.creditCardValidUntilInput.fill(paymentDetails.validUntil)

        await this.creditCardCvcInput.waitFor()
        await this.creditCardCvcInput.fill(paymentDetails.cvc)
    }

    completePayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 })
    }
}