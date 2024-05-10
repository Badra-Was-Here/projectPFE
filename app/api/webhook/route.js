// This file handles webhook events from Stripe. It verifies the signature
// of each request to ensure that the request is coming from Stripe. It also
// handles the checkout.session.completed event type by creating a new purchase record in the database.


import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import connectMongoDB from "@/lib/mongodb";
import { Purchase } from "@/models/purchase";
import Course from "@/models/course";

export async function POST(req) {
    const body = await req.text();
    const signature = headers().get("stripe-signature") ;
    let event;

    try {

      event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    } catch (error) {
         return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object ;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === "checkout.session.completed" ) {
        if (!userId || !courseId) {
        //   const logging = {
        //     url: req.url,
        //     method: req.method,
        //     body: body,
        //     statusCode: 400,
        //     errorMessage: "Missing metadata",
        //     createdAt: new Date(),
        //   };
    
        //   await createLogging(logging);
    
          return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
        }
        const newPurchase = await Purchase.create({ courseId: courseId,userId: userId,})
        
        // Add the purchase to the Course model's purchases array
        await Course.findByIdAndUpdate(courseId, { $push: { purchases: newPurchase } });

    } else {
        return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 })
    }

    return new NextResponse(null, { status: 200 });

}