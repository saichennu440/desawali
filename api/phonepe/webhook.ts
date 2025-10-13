import { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const PHONEPE_SECRET = process.env.PHONEPE_SECRET
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!PHONEPE_SECRET || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // Initialize Supabase with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify PhonePe signature
    const receivedChecksum = req.headers['x-verify'] as string
    const response = req.body.response
    
    if (!receivedChecksum || !response) {
      return res.status(400).json({ error: 'Missing required headers or body' })
    }

    // Verify checksum
    const expectedChecksum = crypto
      .createHash('sha256')
      .update(response + '/pg/v1/status' + PHONEPE_SECRET)
      .digest('hex') + '###1'

    if (receivedChecksum !== expectedChecksum) {
      console.error('Invalid checksum')
      return res.status(400).json({ error: 'Invalid signature' })
    }

    // Decode response
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString())
    
    console.log('PhonePe webhook received:', decodedResponse)

    const { 
      merchantTransactionId, 
      transactionId, 
      amount, 
      state, 
      responseCode 
    } = decodedResponse.data

    // Extract order ID from merchant transaction ID
    const orderIdMatch = merchantTransactionId.match(/TXN_(.+)_\d+/)
    const orderId = orderIdMatch ? orderIdMatch[1] : null

    if (!orderId) {
      console.error('Could not extract order ID from transaction ID:', merchantTransactionId)
      return res.status(400).json({ error: 'Invalid transaction ID format' })
    }

    // Update order status based on payment state
    let orderStatus = 'Pending'
    let paymentStatus = state

    if (state === 'COMPLETED' && responseCode === 'SUCCESS') {
      orderStatus = 'Paid'
      paymentStatus = 'SUCCESS'
    } else if (state === 'FAILED') {
      orderStatus = 'Cancelled'
      paymentStatus = 'FAILED'
    }

    // Update order in database
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        phonepe_payment_id: transactionId,
        phonepe_payment_status: paymentStatus,
        status: orderStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      return res.status(500).json({ error: 'Database update failed' })
    }

    console.log(`Order ${orderId} updated with status: ${orderStatus}`)

    // Send confirmation email (optional)
    if (orderStatus === 'Paid') {
      // TODO: Implement email sending logic
      console.log(`Payment successful for order ${orderId}`)
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}