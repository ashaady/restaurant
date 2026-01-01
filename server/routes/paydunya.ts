import { Request, Response } from "express";
import { paymentsStore, ordersStore } from "./orders";

/**
 * Initialize PayDunya payment
 * POST /api/paydunya/initialize
 *
 * Expects body:
 * {
 *   order_id: string,
 *   payment_id: string,
 *   total: number,
 *   payment_method: "wave" | "orange-money",
 *   order_number: string,
 *   items: OrderItem[],
 *   customer_name: string,
 *   customer_phone: string,
 *   order_type: "livraison" | "emporter"
 * }
 */
export async function handlePaydunya_Initialize(req: Request, res: Response) {
  try {
    const {
      order_id,
      payment_id,
      total,
      payment_method,
      order_number,
      items,
      customer_name,
      customer_phone,
      order_type,
    } = req.body;

    if (!order_id || !payment_id || !total || !payment_method) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Get the payment record to update
    const payment = paymentsStore.get(payment_id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment record not found",
      });
    }

    // Generate PayDunya token
    const paydunya_token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Mock PayDunya API call (in production, this would call real PayDunya API)
    // The payment_url would be returned from PayDunya API
    const mockPaymentUrl = `https://paydunya.com/pay/${paydunya_token}`;

    // Update payment record with PayDunya details
    const updatedPayment = {
      ...payment,
      status: "processing",
      paydunya_token,
      paydunya_invoice_url: mockPaymentUrl,
    };

    paymentsStore.set(payment_id, updatedPayment);
    paymentsStore.set(
      `payment-for-order-${order_id}`,
      updatedPayment
    );

    // In production, you would:
    // 1. Call actual PayDunya API to create invoice
    // 2. Get the real payment URL from PayDunya
    // 3. Store the real token in database
    // 4. Configure webhook URL in PayDunya dashboard

    return res.json({
      success: true,
      payment_url: mockPaymentUrl,
      token: paydunya_token,
      transaction_id: `txn_${Date.now()}`,
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
