import { Request, Response } from "express";

/**
 * Initialize PayDunya payment
 * POST /api/paydunya/initialize
 */
export async function handlePaydunya_Initialize(req: Request, res: Response) {
  try {
    const { order_id, payment_method } = req.body;

    if (!order_id || !payment_method) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // For demo purposes, we'll simulate success
    const mockPaymentUrl = `https://paydunya.com/pay/${order_id}?token=demo_${Date.now()}`;

    const paymentRecord = {
      order_id,
      payment_method,
      transaction_id: `txn_${Date.now()}`,
      paydunya_token: `token_${Date.now()}`,
      payment_url: mockPaymentUrl,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    return res.json({
      success: true,
      payment_url: mockPaymentUrl,
      token: paymentRecord.paydunya_token,
      transaction_id: paymentRecord.transaction_id,
    });
  } catch (error) {
    console.error("PayDunya initialization error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to initialize payment",
    });
  }
}

/**
 * Handle PayDunya callback/webhook
 * POST /api/paydunya/callback
 */
export async function handlePaydunya_Callback(req: Request, res: Response) {
  try {
    const { status, token, custom_data } = req.body;

    const orderId = custom_data?.order_id;

    if (!orderId) {
      return res.status(400).json({
        error: "Order ID missing",
      });
    }

    if (status === "completed") {
      console.log(`Payment successful for order ${orderId}`);
      return res.json({
        success: true,
        message: "Payment processed successfully",
      });
    } else if (status === "failed") {
      console.log(`Payment failed for order ${orderId}`);
      return res.json({
        success: true,
        message: "Payment failure recorded",
      });
    }

    return res.json({
      success: true,
      message: "Callback processed",
    });
  } catch (error) {
    console.error("PayDunya callback error:", error);
    return res.status(500).json({
      error: "Failed to process callback",
    });
  }
}

/**
 * Check payment status
 * GET /api/paydunya/status/:orderId
 */
export async function handlePaydunya_Status(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        error: "Order ID missing",
      });
    }

    const mockStatus = {
      order_id: orderId,
      payment_method: "wave",
      status: "pending",
      transaction_id: `txn_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    return res.json({
      success: true,
      data: mockStatus,
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return res.status(500).json({
      error: "Failed to check payment status",
    });
  }
}
