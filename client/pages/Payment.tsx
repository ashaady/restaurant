import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  order_type: "livraison" | "emporter";
}

export default function Payment() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"wave" | "orange-money">("wave");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load order from localStorage or mock
  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        toast.error("Order ID missing");
        window.location.href = "/";
        return;
      }

      // Try to load from localStorage
      const stored = localStorage.getItem(`order-${orderId}`);
      if (stored) {
        setOrder(JSON.parse(stored));
      } else {
        // Mock order for demo
        setOrder({
          id: orderId,
          orderNumber: "CM12345678",
          customer_name: "Demo Customer",
          customer_phone: "77 123 45 67",
          items: [
            { product_name: "Menu Classique", quantity: 1, price: 4500 },
          ],
          total: 5500,
          order_type: "livraison",
        });
      }
      setIsLoading(false);
    };

    loadOrder();
  }, [orderId]);

  const handlePayment = async () => {
    if (!order) {
      toast.error("Commande non trouvée");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate PayDunya API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production, this would call: /api/paydunya/initialize
      // For demo, we'll simulate success
      const paymentUrl = `https://paydunya.com/pay/${order.id}`;
      const simulateSuccess = true;

      if (simulateSuccess) {
        // Update order status to confirmed
        const updatedOrder = {
          ...order,
          status: "confirmed",
        };
        localStorage.setItem(`order-${order.id}`, JSON.stringify(updatedOrder));

        // Redirect to success page
        window.location.href = `/payment-success?order_id=${order.id}`;
      } else {
        throw new Error("Payment initialization failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Commande non trouvée
          </h1>
          <a href="/" className="text-primary font-semibold">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-6">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🍗</span>
          </div>
          <h1 className="text-xl font-black text-chicken-navy">CHICKEN MASTER</h1>
          <p className="text-sm text-muted-foreground">Finalisation du paiement</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Récapitulatif commande
          </h2>

          <div className="space-y-3 mb-6 pb-6 border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Commande N°</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Client</span>
              <span className="font-semibold">{order.customer_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Type</span>
              <span className="font-semibold">
                {order.order_type === "livraison" ? "🚚 Livraison" : "📦 À emporter"}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-6 pb-6 border-b border-border">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.product_name}
                </span>
                <span className="font-semibold">
                  {(item.price * item.quantity).toLocaleString()} F
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-foreground">Total</span>
            <span className="text-4xl font-black text-primary">
              {order.total.toLocaleString()} F
            </span>
          </div>
        </motion.div>

        {/* Payment Method Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Méthode de paiement
          </h2>

          <RadioGroup value={selectedMethod} onValueChange={(v) => setSelectedMethod(v as any)}>
            <div className="space-y-4">
              {/* Wave */}
              <Label
                htmlFor="wave"
                className="flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all hover:border-primary"
                style={{
                  borderColor:
                    selectedMethod === "wave"
                      ? "hsl(var(--primary))"
                      : "hsl(var(--border))",
                  backgroundColor:
                    selectedMethod === "wave"
                      ? "hsl(var(--primary) / 0.05)"
                      : "transparent",
                }}
              >
                <div className="w-16 h-12 bg-white rounded-lg border border-blue-200 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">Wave</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-foreground">Wave</p>
                  <p className="text-sm text-muted-foreground">
                    Paiement instantané et sécurisé
                  </p>
                </div>
                <RadioGroupItem value="wave" id="wave" className="ml-4" />
              </Label>

              {/* Orange Money */}
              <Label
                htmlFor="orange-money"
                className="flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all hover:border-primary"
                style={{
                  borderColor:
                    selectedMethod === "orange-money"
                      ? "hsl(var(--primary))"
                      : "hsl(var(--border))",
                  backgroundColor:
                    selectedMethod === "orange-money"
                      ? "hsl(var(--primary) / 0.05)"
                      : "transparent",
                }}
              >
                <div className="w-16 h-12 bg-white rounded-lg border border-orange-200 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-xs font-bold text-orange-600">Orange</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-foreground">Orange Money</p>
                  <p className="text-sm text-muted-foreground">
                    Paiement mobile rapide
                  </p>
                </div>
                <RadioGroupItem value="orange-money" id="orange-money" className="ml-4" />
              </Label>
            </div>
          </RadioGroup>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
        >
          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">🔒 Paiement sécurisé</p>
            <p className="text-sm text-blue-700 mt-1">
              Vos données sont protégées par PayDunya
            </p>
          </div>
        </motion.div>

        {/* Payment Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-bold text-lg flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Connexion sécurisée...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Payer {order.total.toLocaleString()} F
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
