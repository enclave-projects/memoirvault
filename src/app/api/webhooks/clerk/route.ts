import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { updateUserPlan } from '@/lib/storage';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
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
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: any;

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
      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionChange(evt.data);
        break;
      
      case 'subscription.deleted':
        await handleSubscriptionCancellation(evt.data);
        break;
      
      case 'user.created':
        // Initialize storage for new users
        if (evt.data.id) {
          // Storage will be initialized automatically when they first access the dashboard
          console.log(`New user created: ${evt.data.id}`);
        }
        break;
      
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}

async function handleSubscriptionChange(data: any) {
  try {
    const userId = data.user_id;
    const planName = data.plan?.name?.toLowerCase();
    
    if (!userId) {
      console.error('No user ID in subscription data');
      return;
    }

    // Map Clerk plan names to our internal plan names
    let plan: 'free' | 'basic' | 'pro' = 'free';
    
    if (planName?.includes('basic')) {
      plan = 'basic';
    } else if (planName?.includes('pro')) {
      plan = 'pro';
    }

    // Update user storage plan
    await updateUserPlan(userId, plan);
    
    console.log(`Updated user ${userId} to ${plan} plan`);
  } catch (error) {
    console.error('Error handling subscription change:', error);
    throw error;
  }
}

async function handleSubscriptionCancellation(data: any) {
  try {
    const userId = data.user_id;
    
    if (!userId) {
      console.error('No user ID in subscription cancellation data');
      return;
    }

    // Downgrade to free plan
    await updateUserPlan(userId, 'free');
    
    console.log(`Downgraded user ${userId} to free plan after cancellation`);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
    throw error;
  }
}