import { Button } from '@/shared/components/ui/button';
import ResponsiveModal from '@/components/atoms/responsive-modal';

interface AgeWarningModalProps {
    open: boolean;
    onAccept: () => void;
    onQuit: () => void;
}

export default function AgeWarningModal({ open, onAccept, onQuit }: AgeWarningModalProps) {
    return (
        <ResponsiveModal open={open} maxWidth="md">
            <div className="px-6 py-4 flex flex-col items-center">
                <img src="/logo/vapo-logo-2.svg" alt="VapoStore Logo" className="my-4" />
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-vapo-purple-primary text-3xl">&#9432;</span>
                    <span className="text-vapo-purple-primary text-xl font-semibold">AVERTISSEMENT</span>
                </div>
                <p className="text-sm text-gray-800 mb-4 text-center">
                    La vente de Cigarettes électroniques est interdite aux personnes mineures et n’est pas recommandée aux femmes enceintes ou qui allaitent. De plus, en cas de pathologie particulières (maladies cardio-vasculaires, asthme, épilepsie…), Vapostore vous recommande d’en parler avec votre médecin traitant avant utilisation.
                </p>
                <p className="text-vapo-purple-primary font-semibold mb-6 text-center">
                    En cliquant sur le bouton Entrer, vous certifiez avoir au moins 18 ans.
                </p>
                <div className='flex flex-col gap-2 mb-2 w-full'>
                    <Button
                        variant={'vapo'}
                        className='py-2'
                        onClick={onAccept}
                    >
                        Accepter
                    </Button>
                    <Button
                        variant={'vapo-secondary'}
                        className='py-2'
                        onClick={onQuit}
                    >
                        Quitter
                    </Button>
                </div>
            </div>
        </ResponsiveModal>
    );
}
