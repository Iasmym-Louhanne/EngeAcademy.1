import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/integrations/stripe/client';
import { getCourseById } from '@/lib/course-service';

export async function POST(req: NextRequest) {
  try {
    const { courseId, quantity = 1, successUrl, cancelUrl } = await req.json();

    if (!courseId || !successUrl || !cancelUrl) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const course = await getCourseById(courseId);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            unit_amount: Math.round((course.price || 0) * 100),
            product_data: { name: course.title }
          },
          quantity
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
