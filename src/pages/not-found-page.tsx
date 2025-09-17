import Typography from "@/components/atoms/typography";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router";


export default function NotFoundPage() {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <Typography className="text-vapo-purple-primary">
                404
            </Typography>
            <Typography className="text-vapo-purple-primary">
                Page introuvable
            </Typography>
            <Typography className="text-center max-w-md text-vapo-purple-primary">
                La page que vous cherchez n'existe pas ou a été déplacée.
            </Typography>
            <Button onClick={handleGoHome}>
                Retour à l'accueil
            </Button>
        </div>
    );
}
