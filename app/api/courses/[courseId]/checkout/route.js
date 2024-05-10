import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Course from "@/models/course";
import { Purchase, StripeCustomer } from "@/models/purchase";
import { stripe } from "@/lib/stripe";

export async function POST(req, { params }) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await Course.findOne({
      _id: params.courseId,
      isPublished: true,
    });
    const purchase = await Purchase.findOne({
      userId: user.id,
      courseId: params.courseId,
    });
    if (purchase) {
      return new NextResponse("Already Purchased", { status: 400 });
    }
    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const lineItems = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
          },
          unit_amount: Math.round(course.price * 100),
        },
      },
    ];

    let stripeCustomer = await StripeCustomer.findOne({ userId: user.id });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses?.[0]?.emailAddress,
      });
      stripeCustomer = await StripeCustomer.create({
        userId: user.id,
        stripeCustomerId: customer.id,
      });
    }

    const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
        metadata: {
            courseId: course.id,
            userId: user.id,
        },
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.log("COURSE_ID_CHECKOUT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
