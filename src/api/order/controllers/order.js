"use strict";
//@ts-ignore
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products } = ctx.request.body;
    
    // DEBUG COMPLETO
    console.log("=== DEBUG VARIABLES DE ENTORNO ===");
    console.log("CLIENT_URL raw:", JSON.stringify(process.env.CLIENT_URL));
    console.log("CLIENT_URL length:", process.env.CLIENT_URL?.length);
    console.log("CLIENT_URL starts with http://:", process.env.CLIENT_URL?.startsWith('http://'));
    console.log("CLIENT_URL starts with https://:", process.env.CLIENT_URL?.startsWith('https://'));
    console.log("All CLIENT_URL chars:", process.env.CLIENT_URL?.split('').map((c, i) => `${i}: '${c}' (${c.charCodeAt(0)})`));
    console.log("STRIPE_KEY exists:", !!process.env.STRIPE_KEY);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("=====================================");

    try {
      const lineItems = products.map((item) => ({
        price_data: {
          currency: "MXN",
          product_data: {
            name: item.productName,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      }));

      // Forzar HTTP para testing
      const baseUrl = process.env.CLIENT_URL?.replace('https://', 'http://') || 'http://localhost:3000';
      const successUrl = `${baseUrl}/success`;
      const cancelUrl = `${baseUrl}/cancel`;

      console.log("Original CLIENT_URL:", process.env.CLIENT_URL);
      console.log("Forced baseUrl:", baseUrl);
      console.log("Final Success URL:", successUrl);
      console.log("Final Cancel URL:", cancelUrl);

      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: { allowed_countries: ["MX"] },
        payment_method_types: ["card"],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        line_items: lineItems,
      });

      console.log("Stripe session created:", session.id);
      console.log("Session URL:", session.url);

      const order = await strapi.service("api::order.order").create({
        data: {
          products,
          stripeId: session.id,
        },
      });

      console.log("Order created:", order.id);

      return { stripeSession: session };
    } catch (error) {
      console.error("Error creating order:", error);
      ctx.response.status = 500;
      return {
        error: "Error al crear la orden",
        details: error.message,
      };
    }
  },
}));