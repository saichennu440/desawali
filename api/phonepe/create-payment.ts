import { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

interface PaymentRequest {
  order_id: string
  amount: number // in paise
  user_phone: string
  user_email?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { order_id, amount, user_phone, user_email }: PaymentRequest = req.body

    // Validate required fields
    if (!order_id || !amount || !user_phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: order_id, amount, user_phone'
      })
    }

    // PhonePe configuration
    const PHONEPE_MID = process.env.PHONEPE_MID
    const PHONEPE_SECRET = process.env.PHONEPE_SECRET
    const PHONEPE_BASE_URL = process.env.NODE_ENV === 'production' 
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox'

    if (!PHONEPE_MID || !PHONEPE_SECRET) {
      console.error('PhonePe credentials not configured')
      return res.status(500).json({
        status: 'error',
        message: 'Payment gateway not configured'
      })
    }

    // Generate unique transaction ID
    const transactionId = `TXN_${order_id}_${Date.now()}`
    
    // Create payment payload
    const paymentPayload = {
      merchantId: PHONEPE_MID,
      merchantTransactionId: transactionId,
      merchantUserId: `USER_${order_id}`,
      amount: amount,
      redirectUrl: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/payment/success?order_id=${order_id}`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/api/phonepe/webhook`,
      mobileNumber: user_phone,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    }

    // Encode payload
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64')
    
    // Create checksum
    const checksumString = base64Payload + '/pg/v1/pay' + PHONEPE_SECRET
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex') + '###1'

    // Make request to PhonePe
    const phonepeResponse = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({
        request: base64Payload
      })
    })

    const responseData = await phonepeResponse.json()

    if (responseData.success && responseData.data?.instrumentResponse?.redirectInfo?.url) {
      // Update order with payment ID
      // Note: You'll need to import and configure Supabase here
      // For now, we'll just return the payment URL
      
      return res.status(200).json({
        status: 'success',
        payment_url: responseData.data.instrumentResponse.redirectInfo.url,
        payment_id: transactionId,
        message: 'Payment initiated successfully'
      })
    } else {
      console.error('PhonePe API error:', responseData)
      return res.status(400).json({
        status: 'error',
        message: responseData.message || 'Payment initiation failed'
      })
    }

  } catch (error) {
    console.error('Payment creation error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
}