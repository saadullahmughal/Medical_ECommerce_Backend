document.addEventListener("DOMContentLoaded", async () => {
    // Load the publishable key from the server. The publishable key
    // is set in your .env file.
    // const publishableKey =
    //     "pk_test_51PgnayRvSZigFhCPmElFI93HofxDM45oiuPIAAoPfBNbvOMrf4gRyXTJgke2LFELn8G9u8X3AhMZuaVGRWZLuD1o00dcoViVb7";
    // if (!publishableKey) {
    //     addMessage(
    //         "No publishable key returned from the server. Please check `.env` and try again"
    //     );
    //     alert("Please set your Stripe publishable API key in the .env file");
    // }

    // const stripe = Stripe(publishableKey, {
    //     apiVersion: "2020-08-27",
    // });

    const url = new URL(window.location);
    const clientSecret = url.searchParams.get("payment_intent");

    const fetchResponse = await fetch("http://localhost:3000/pay/capture", {
        method: "post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            intent_id: clientSecret,
            capture: true,
        }),
    });
    const { done, message } = await fetchResponse.json();

    addMessage(message);

    // const { error, paymentIntent } = await stripe.retrievePaymentIntent(
    //     clientSecret
    // );
    // if (error) {
    //     addMessage(error.message);
    // }
    // addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
});
