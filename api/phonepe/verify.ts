import { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transaction_id } = req.query

    if (!transaction_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Transaction ID is required'
      })
    }

    const PHONEPE_MID = process.env.PHONEPE_MID
    const PHONEPE_SECRET = process.env.PHONEPE_SECRET
    const PHONEPE_BASE_URL = process.env.NODE_ENV === 'production' 
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox'

    if (!PHONEPE_MID || !PHONEPE_SECRET) {
      return res.status(500).json({
        status: 'error',
        message: 'Payment gateway not configured'
      })
    }

    // Create checksum for status check
    const checksumString = `/pg/v1/status/${PHONEPE_MID}/${transaction_id}` + PHONEPE_SECRET
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex') + '###1'

    // Check payment status
    const statusResponse = await fetch(
      `${PHONEPE_BASE_URL}/pg/v1/status/${PHONEPE_MID}/${transaction_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': PHONEPE_MID
        }
      }
    )

    const statusData = await statusResponse.json()

    return res.status(200).json({
      status: 'success',
      data: statusData
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
}