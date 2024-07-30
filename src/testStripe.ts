// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import { Stripe } from "stripe"
import { configDotenv } from "dotenv"
configDotenv()

const stripeKey = process.env?.STRIPE_KEY as string

const stripeInstance = new Stripe(
    stripeKey
);

const testFn = async () => {
    try {

        const number = "4242424242424242"
        const customer = await stripeInstance.customers.create({ name: "Saadullah", "email": "saad@saad.dev" })
        console.log("Customer created:", customer.id)
        const card = await stripeInstance.tokens.create({ card: { name: "M Saadullah Zafar", number: number, exp_month: "12", exp_year: "2025", cvc: "123", currency: "PKR" } })
        console.log("Card added:", card.id)
        //await stripeInstance.customers.createSource(customer.id, { source: "tok_visa" })
        //const payment = await stripeInstance.paymentIntents.create({ amount: 5000, currency: "pkr", payment_method: card.id })
        //const results = await stripeInstance.paymentIntents.confirm(payment.id)
        //const results = await stripeInstance.charges.create({ amount: 500 * 100, customer: customer.id, currency: "pkr" })
        const paymentIntent = await stripeInstance.paymentIntents.create({ amount: 500 * 100, currency: "pkr", payment_method: "tok_visa", customer: customer.id })
        console.log("PaymentIntent generated:", paymentIntent.id)
        const results = await stripeInstance.paymentIntents.confirm(paymentIntent.id)
        console.log("Confirmed:", results.id)
        //console.log(results.id)
    } catch (error) {
        //console.error((error as Stripe.errors.StripeError).code || "ERROR")
        console.error(error)
    }
    // const paymentIntent = await stripeInstance.paymentIntents.create({
    //     amount: 500,
    //     currency: "gbp",
    //     payment_method: "pm_card_visa",
    // });
}

testFn()
