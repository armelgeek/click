import IdentityVerificationModal from '@/components/organisms/identity-verification-modal';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import ResponsiveContainer from '@/components/atoms/responsive-container';

export default function IdentityVerificationPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleSuccess = () => {
    setOpen(false);
    // Redirige vers le profil après succès
    setTimeout(() => {
      navigate('/profile/home');
    }, 1500);
  };

  const handleSkip = () => {
    setOpen(false);
    navigate('/profile/home');
  };

  return (
    <ResponsiveContainer maxWidth="mobile" centerOnDesktop>
      <IdentityVerificationModal
        open={open}
        onVerificationSuccess={handleSuccess}
        onSkip={handleSkip}
        onClose={() => setOpen(false)}
      />
    </ResponsiveContainer>
  );
}
