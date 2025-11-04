import { Button } from '@/shared/components/ui/button';
import ResponsiveModal from '@/components/atoms/responsive-modal';

interface AgeWarningModalProps {
    open: boolean;
    onAccept: () => void;
    onQuit: () => void;
}

export default function AgeWarningModal({ open, onAccept, onQuit }: AgeWarningModalProps) {
    return (
        <ResponsiveModal open={open} maxWidth="sm">
            <div className="px-8 py-8 flex flex-col items-center rounded-2xl bg-white shadow-xl">
                <img src="/logo/vapo-logo-2.png" width={180} alt="VapoStore Logo" className="mb-2 mt-2" />
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-vapo-purple-primary text-2xl"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#A020B6" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#A020B6" fontFamily="Arial" dy="-2">i</text></svg></span>
                    <span className="text-vapo-purple-primary text-xl font-semibold">AVERTISSEMENT</span>
                </div>
                <p className="text-sm text-gray-800 mb-2 text-center leading-relaxed">
                    La vente de Cigarettes électroniques est interdite aux personnes mineures et n’est pas recommandée aux femmes enceintes ou qui allaitent. De plus, en cas de pathologie particulières (maladies cardio-vasculaires, asthme, épilepsie…), Vapostore vous recommande d’en parler avec votre médecin traitant avant utilisation.
                </p>
                <p className="text-vapo-purple-primary font-semibold mb-4 text-center">
                    En cliquant sur le bouton Entrer, vous certifiez avoir au moins 18 ans.
                </p>
                <div className='flex flex-col gap-2 w-full'>
                    <Button
                        variant='default'
                        className='bg-vapo-purple-primary text-white text-base font-semibold py-3 rounded-lg shadow-sm hover:bg-vapo-purple-primary/90 transition-colors duration-150'
                        onClick={onAccept}
                    >
                        Accepter
                    </Button>
                    <Button
                        variant='outline'
                        className='bg-vapo-purple-primary/10 text-vapo-purple-primary text-base font-semibold py-3 rounded-lg shadow-sm border-none hover:bg-vapo-purple-primary/20 transition-colors duration-150'
                        onClick={onQuit}
                    >
                        Quitter
                    </Button>
                </div>
            </div>
        </ResponsiveModal>
    );
}
