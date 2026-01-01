import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  ChefHat,
  Package,
  Truck,
  MapPin,
  Phone,
  User,
  ChevronLeft,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  note: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  orderType: "livraison" | "emporter";
  items: OrderItem[];
  total: number;
  createdAt: string;
  customer_name: string;
  customer_phone: string;
  delivery_address?: string;
  status_history: StatusHistoryEntry[];
  estimated_delivery_time?: string;
}

const statusConfig: Record<
  string,
  { icon: React.ReactNode; label: string; color: string; bgColor: string }
> = {
  pending: {
    icon: <Clock className="w-8 h-8" />,
    label: "En attente",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  confirmed: {
    icon: <CheckCircle className="w-8 h-8" />,
    label: "Confirmée",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  preparing: {
    icon: <ChefHat className="w-8 h-8" />,
    label: "En préparation",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  ready: {
    icon: <Package className="w-8 h-8" />,
    label: "Prête",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  out_for_delivery: {
    icon: <Truck className="w-8 h-8" />,
    label: "En livraison",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  delivered: {
    icon: <CheckCircle className="w-8 h-8" />,
    label: "Livrée",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  cancelled: {
    icon: <Clock className="w-8 h-8" />,
    label: "Annulée",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
};

// Mock order fetching
function getMockOrder(id: string): Order | null {
  const orders: Record<string, Order> = {
    "order-1": {
      id: "order-1",
      orderNumber: "CM12345678",
      status: "delivered",
      orderType: "livraison",
      items: [
        { product_name: "Menu Classique", quantity: 1, price: 4500 },
        { product_name: "Frites Sauce", quantity: 1, price: 1500 },
      ],
      total: 7000,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      customer_name: "Amadou Diop",
      customer_phone: "77 123 45 67",
      delivery_address: "Sicap Liberté 6, Villa 123",
      estimated_delivery_time: "30-45 min",
      status_history: [
        { status: "pending", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(), note: "Commande reçue" },
        { status: "confirmed", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(), note: "Confirmée" },
        { status: "preparing", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), note: "En préparation" },
        { status: "ready", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), note: "Prête" },
        { status: "out_for_delivery", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString(), note: "En route" },
        { status: "delivered", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000).toISOString(), note: "Livrée" },
      ],
    },
  };

  // Try to get from localStorage first
  const stored = localStorage.getItem(`order-${id}`);
  if (stored) {
    return JSON.parse(stored);
  }

  return orders[id] || null;
}

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate("/orders");
      return;
    }

    const fetchOrder = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = getMockOrder(orderId);
      if (data) {
        setOrder(data);
      } else {
        toast.error("Commande non trouvée");
        navigate("/orders");
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <Layout cartCount={0}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout cartCount={0}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Commande non trouvée</h1>
          <Link to="/orders" className="mt-4 inline-block text-primary font-semibold">
            Retour aux commandes
          </Link>
        </div>
      </Layout>
    );
  }

  const currentStatusConfig = statusConfig[order.status];
  const steps = order.orderType === "livraison"
    ? ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"]
    : ["pending", "confirmed", "preparing", "ready"];

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = order.orderType === "livraison" ? 1000 : 0;

  return (
    <Layout cartCount={0}>
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-red-700 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Link
            to="/orders"
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity w-fit"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Mes commandes</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Commande #{order.orderNumber}
          </h1>
          <p className="text-white/90">
            {new Date(order.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-chicken-gray py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column: Timeline */}
            <div className="md:col-span-2">
              {order.status === "cancelled" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center"
                >
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">❌</span>
                  </div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">
                    Commande Annulée
                  </h2>
                  <p className="text-red-600">
                    Cette commande a été annulée. Veuillez contacter le support si vous avez des questions.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Current Status Card */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${currentStatusConfig.bgColor} rounded-2xl p-6 md:p-8 mb-8`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: currentStatusConfig.bgColor,
                        }}
                      >
                        <div className={currentStatusConfig.color}>
                          {currentStatusConfig.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-1">
                          {currentStatusConfig.label}
                        </h3>
                        <p className="text-muted-foreground">
                          {order.estimated_delivery_time &&
                            `⏱️ Temps estimé: ${order.estimated_delivery_time}`}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    {steps.map((stepStatus, idx) => {
                      const stepConfig = statusConfig[stepStatus];
                      const isCompleted = steps.indexOf(order.status) >= idx;
                      const isActive = order.status === stepStatus;
                      const statusHistoryEntry = order.status_history.find(
                        (h) => h.status === stepStatus
                      );

                      return (
                        <motion.div
                          key={stepStatus}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-4 relative"
                        >
                          {/* Timeline Line */}
                          {idx < steps.length - 1 && (
                            <div
                              className="absolute left-10 top-20 w-1 h-12 bg-gray-200 -z-10"
                              style={{
                                backgroundColor: isCompleted
                                  ? "hsl(var(--chicken-green))"
                                  : "hsl(var(--border))",
                              }}
                            />
                          )}

                          {/* Step Circle */}
                          <div
                            className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                            style={{
                              background: isCompleted
                                ? "hsl(var(--chicken-green))"
                                : "hsl(var(--border))",
                              border: isActive
                                ? "3px solid hsl(var(--chicken-green))"
                                : "none",
                            }}
                          >
                            <div
                              className={`${
                                isCompleted ? "text-white" : "text-muted-foreground"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-8 h-8" />
                              ) : (
                                statusConfig[stepStatus].icon
                              )}
                            </div>
                          </div>

                          {/* Step Info */}
                          <div className="pt-2 flex-1">
                            <h4
                              className={`font-bold text-lg ${
                                isCompleted ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {stepConfig.label}
                            </h4>
                            {statusHistoryEntry && (
                              <div className="text-sm text-muted-foreground mt-1">
                                <p>{statusHistoryEntry.note}</p>
                                <p className="text-xs">
                                  {new Date(statusHistoryEntry.timestamp).toLocaleTimeString(
                                    "fr-FR",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Info Cards */}
            <div className="space-y-4">
              {/* Customer Info */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Informations client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{order.customer_phone}</span>
                  </div>
                  {order.delivery_address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{order.delivery_address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="font-semibold text-foreground">
                        {(item.price * item.quantity).toLocaleString()} F
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="text-foreground font-semibold">
                        {subtotal.toLocaleString()} F
                      </span>
                    </div>
                    {order.orderType === "livraison" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Livraison</span>
                        <span className="text-foreground font-semibold">
                          {deliveryFee.toLocaleString()} F
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold text-primary">
                        {order.total.toLocaleString()} F
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
