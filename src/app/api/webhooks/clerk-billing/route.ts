import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { updateUserPlan, initializeUserStorage, PlanType } from '@/lib/storage';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  
  try {
    switch (eventType) {
      case 'user.created':
        // Initialize storage for new users
        await initializeUserStorage(evt.data.id, 'free');
        console.log(`Initialized storage for new user: ${evt.data.id}`);
        break;

      case 'billing.subscription.created':
      case 'billing.subscription.updated':
        // Update user plan based on subscription
        const userId = evt.data.user_id;
        const planName = evt.data.plan?.name?.toLowerCase();
        
        let newPlan: PlanType = 'free';
        if (planName === 'basic') newPlan = 'basic';
        else if (planName === 'pro') newPlan = 'pro';
        
        await updateUserPlan(userId, newPlan);
        console.log(`Updated plan for user ${userId} to ${newPlan}`);
        break;

      case 'billing.subscription.cancelled':
      case 'billing.subscription.deleted':
        // Downgrade to free plan
        const cancelledUserId = evt.data.user_id;
        await updateUserPlan(cancelledUserId, 'free');
        console.log(`Downgraded user ${cancelledUserId} to free plan`);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}