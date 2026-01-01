import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    toast.error("❌ Paiement annulé");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {/* Cancel Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <XCircle className="w-16 h-16 text-orange-600" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-black text-foreground mb-2">
            Paiement annulé
          </h1>

          <p className="text-lg text-muted-foreground mb-2">
            Vous avez annulé le paiement
          </p>

          <p className="text-sm text-gray-500 mb-8">
            Votre commande est toujours en attente. Vous pouvez réessayer le paiement maintenant ou plus tard.
          </p>

          {/* Info Card */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8">
            <p className="text-sm text-orange-700">
              ⚠️ Si vous avez été débité, le montant sera remboursé dans 24-48 heures
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {orderId && (
              <Link
                to={`/payment?order_id=${orderId}`}
                className="block w-full"
              >
                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-bold flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Réessayer le paiement
                </Button>
              </Link>
            )}

            <Link to="/" className="block w-full">
              <Button
                variant="outline"
                className="w-full h-12 font-bold flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-xs text-gray-500 mb-3">
            Vous avez des questions ?
          </p>
          <a
            href="https://wa.me/221771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline text-sm"
          >
            Contactez notre support →
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
