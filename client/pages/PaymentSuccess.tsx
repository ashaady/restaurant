import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    toast.success("✅ Paiement effectué avec succès!");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <CheckCircle className="w-16 h-16 text-green-600" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-black text-foreground mb-2">
            Paiement réussi !
          </h1>

          <p className="text-lg text-muted-foreground mb-2">
            Votre commande a été confirmée
          </p>

          <p className="text-sm text-gray-500 mb-8">
            Vous recevrez une notification à chaque étape de sa préparation
          </p>

          {/* Order Details Card */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Statut</span>
              <span className="font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                ✓ Confirmée
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Paiement</span>
              <span className="font-bold text-green-600">✓ Reçu</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Préparation</span>
              <span className="font-bold text-orange-600">En cours</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {orderId && (
              <Link
                to={`/order/${orderId}`}
                className="block w-full"
              >
                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-bold flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Suivre ma commande
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

        {/* Footer Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-400 mt-6"
        >
          Merci pour votre commande ! 🍗
        </motion.p>
      </motion.div>
    </div>
  );
}
