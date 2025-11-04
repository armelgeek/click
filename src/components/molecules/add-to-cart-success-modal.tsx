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
                    <DialogTitle className="flex items-center gap-2 text-clicknvape-green text-lg font-semibold">
                        <CheckCircle className="w-6 h-6 text-clicknvape-green" />
                        Produit ajouté au panier
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <p className="text-gray-800 text-base">
                        <span className="font-bold text-gray-900">{productName}</span> a été ajouté à votre panier avec succès.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-6 pt-2">
                        <Button
                            variant="outline"
                            onClick={onContinueShopping}
                            className="rounded-lg border border-clicknvape-green text-clicknvape-green px-6 py-2 font-medium bg-white hover:bg-clicknvape-green/10"
                        >
                            Continuer mes achats
                        </Button>
                        <Button
                            variant="default"
                            onClick={onGoToCart}
                            className="rounded-lg bg-clicknvape-green text-white px-6 py-2 font-medium shadow-sm hover:bg-clicknvape-green/90"
                        >
                            Voir mon panier
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}