import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface AddToCartSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinueShopping: () => void;
    onGoToCart: () => void;
    productName: string;
}

export function AddToCartSuccessModal({
    isOpen,
    onClose,
    onContinueShopping,
    onGoToCart,
    productName
}: AddToCartSuccessModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-vapo-purple-primary">
                        <CheckCircle className="w-6 h-6" />
                        Produit ajouté au panier
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-gray-700">
                        {productName} a été ajouté à votre panier avec succès.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={onContinueShopping}
                            className="sm:order-1"
                        >
                            Continuer mes achats
                        </Button>
                        <Button
                            variant="vapo"
                            onClick={onGoToCart}
                            className="sm:order-2"
                        >
                            Voir mon panier
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}