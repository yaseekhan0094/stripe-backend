const express = require('express');
const app = express();
const stripe = require('stripe')('YOUR_SECRET_KEY'); // Replace with your Stripe Secret Key
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
    const { brand, amount, agent } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: brand,
                        metadata: {
                            agent: agent
                        }
                    },
                    unit_amount: Math.round(amount * 100), // cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://nxfy.io/success',
            cancel_url: 'https://nxfy.io/cancel',
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(4242, () => console.log('✅ Server running on port 4242'));
