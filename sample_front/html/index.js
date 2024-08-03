document.addEventListener("DOMContentLoaded", async () => {
    // Load the publishable key from the server. The publishable key
    // is set in your .env file.
    // // const { publishableKey } = await fetch("/config").then((r) => r.json());
    // // if (!publishableKey) {
    // //     addMessage(
    // //         "No publishable key returned from the server. Please check `.env` and try again"
    // //     );
    // //     alert("Please set your Stripe publishable API key in the .env file");
    // // }

    const publishableKey =
        "pk_test_51PgnayRvSZigFhCPmElFI93HofxDM45oiuPIAAoPfBNbvOMrf4gRyXTJgke2LFELn8G9u8X3AhMZuaVGRWZLuD1o00dcoViVb7";

    const stripe = Stripe(publishableKey, {
        apiVersion: "2020-08-27",
    });

    // On page load, we create a PaymentIntent on the server so that we have its clientSecret to
    // initialize the instance of Elements below. The PaymentIntent settings configure which payment
    // method types to display in the PaymentElement.
    // const fetchResponse = await fetch(
    //     "http://localhost:3000/pay/create-intent"
    // );
    // const { done, message } = await fetchResponse.json();
    // console.log(done, message);
    // if (!done) {
    //     addMessage(message);
    // }
    // addMessage(`Client secret returned.`);
    // const clientSecret = message;

    // Initialize Stripe Elements with the PaymentIntent's clientSecret,
    // then mount the payment element.
    const loader = "auto";
    const elements = stripe.elements({
        clientSecret:
            "pi_3Pjkf5RvSZigFhCP1h2c9LVu_secret_Sv9p7yPn0xWyp8fZJcDr6fJNk",
        loader,
    });
    const paymentElement = elements.create("payment", {
        defaultValues: {
            billingDetails: { email: "saadullahmughal4@gmail.com" },
        },
    });
    paymentElement.mount("#payment-element");
    // Create and mount the linkAuthentication Element to enable autofilling customer payment details
    const linkAuthenticationElement = elements.create("linkAuthentication");
    linkAuthenticationElement.mount("#link-authentication-element");
    // If the customer's email is known when the page is loaded, you can
    // pass the email to the linkAuthenticationElement on mount:
    //
    //   linkAuthenticationElement.mount("#link-authentication-element",  {
    //     defaultValues: {
    //       email: 'jenny.rosen@example.com',
    //     }
    //   })
    // If you need access to the email address entered:
    //
    //  linkAuthenticationElement.on('change', (event) => {
    //    const email = event.value.email;
    //    console.log({ email });
    //  })

    // When the form is submitted...
    const form = document.getElementById("payment-form");
    let submitted = false;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Disable double submission of the form
        if (submitted) {
            return;
        }
        submitted = true;
        form.querySelector("button").disabled = true;

        const nameInput = document.querySelector("#name");

        // Confirm the payment given the clientSecret
        // from the payment intent that was just created on
        // the server.
        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/return.html`,
            },
        });

        if (stripeError) {
            addMessage(stripeError.message);

            // reenable the form.
            submitted = false;
            form.querySelector("button").disabled = false;
            return;
        }
    });
});
