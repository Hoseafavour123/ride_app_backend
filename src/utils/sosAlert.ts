import axios from 'axios'
import { SOSDocument } from '../models/sos.model'
import { sendMail } from './sendMail'

export const sendEmergencyWebhook = async (sos: SOSDocument) => {
  const webhookUrl = process.env.EMERGENCY_WEBHOOK_URL
  const fallbackEmail = process.env.EMERGENCY_FALLBACK_EMAIL

  if (!webhookUrl) return

  const payload = {
    type: 'SOS_ALERT',
    triggeredAt: new Date(),
    user: {
      id: sos.userId,
      role: sos.role,
    },
    rideId: sos.rideId,
    deliveryId: sos.deliveryId,
    location: { coordinates: sos.location.coordinates, address: sos.location.address || 'Not provided' },
    note: sos.note,
    status: sos.status,
  }

  try {
    await axios.post(webhookUrl, payload, {
      timeout: 5000,
    })
  } catch (error) {
    console.error(error, '[Webhook Failed] Trying email fallback...')

    // Fallback email
    if (fallbackEmail) {
      const subject = '🚨 SOS Alert Triggered'
      const body = `
        <h2>SOS Triggered</h2>
        <p><b>User ID:</b> ${sos.userId}</p>
        <p><b>Role:</b> ${sos.role}</p>
        <p><b>Ride ID:</b> ${sos.rideId || '-'}</p>
        <p><b>Delivery ID:</b> ${sos.deliveryId || '-'}</p>
        <p><b>Note:</b> ${sos.note || 'None'}</p>
        <p><b>Location:</b> [${sos.location.coordinates.join(', ')}]</p>
        <p><b>Status:</b> ${sos.status}</p>
        <p><b>Time:</b> ${new Date().toLocaleString()}</p>
      `
      await sendMail({
        email: fallbackEmail,
        subject,
        html: body,
      })
    }
  }
}