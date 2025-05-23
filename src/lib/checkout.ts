import { getStripe } from "./stripe";

export async function redirectToCheckout(priceId: string) {
  try {
    const stripe = await getStripe();

    if (!stripe) {
      throw new Error("Stripe failed to initialize");
    }

    // Create a Checkout Session directly from the client
    const { error } = await stripe.redirectToCheckout({
      mode: "subscription",
      lineItems: [{ price: priceId, quantity: 1 }],
      successUrl: `${window.location.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/pricing`,
    });

    if (error) {
      console.error("Error redirecting to checkout:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in redirectToCheckout:", error);
    throw error;
  }
}
