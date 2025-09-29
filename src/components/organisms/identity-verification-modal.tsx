import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { CheckCircle, AlertCircle, IdCard } from 'lucide-react';
import ResponsiveModal from '@/components/atoms/responsive-modal';

const identityVerificationSchema = z.object({
  documentType: z.enum(['cni', 'passport', 'license']).refine(
    (val) => ['cni', 'passport', 'license'].includes(val),
    { message: 'Veuillez sélectionner un type de document' }
  ),
  documentNumber: z.string().min(6, 'Numéro de document requis (minimum 6 caractères)'),
  birthDate: z.string().min(1, 'Date de naissance requise'),
  postalCode: z.string().regex(/^\d{5}$/, 'Code postal français requis (5 chiffres)'),
});

type IdentityVerificationFormValues = z.infer<typeof identityVerificationSchema>;

interface IdentityVerificationModalProps {
  open: boolean;
  onVerificationSuccess: () => void;
  onSkip: () => void;
  onClose?: () => void; 
}

type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

export default function IdentityVerificationModal({ 
  open, 
  onVerificationSuccess, 
  onSkip
}: IdentityVerificationModalProps) {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IdentityVerificationFormValues>({
    resolver: zodResolver(identityVerificationSchema),
    defaultValues: {
      documentType: 'cni',
      documentNumber: '',
      birthDate: '',
      postalCode: '',
    },
    mode: 'onChange',
  });

  const simulateIdentityVerification = async (data: IdentityVerificationFormValues): Promise<boolean> => {

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const validDocumentPatterns = {
      cni: /^[0-9]{12}$|^[0-9A-Z]{12}$/, // French CNI format
      passport: /^[0-9]{2}[A-Z]{2}[0-9]{5}$/, // French passport format
      license: /^[0-9]{12}$/ // French driving license format
    };

    const isValidFormat = validDocumentPatterns[data.documentType]?.test(data.documentNumber);
    
    const mockInvalidNumbers = ['000000000000', '123456789012'];
    const isValidNumber = !mockInvalidNumbers.includes(data.documentNumber);
    
    return isValidFormat && isValidNumber;
  };

  const onSubmit = async (data: IdentityVerificationFormValues) => {
    setVerificationStatus('loading');
    setErrorMessage('');

    try {
      const isValid = await simulateIdentityVerification(data);
      
      if (isValid) {
        setVerificationStatus('success');
        setTimeout(() => {
          onVerificationSuccess();
          reset();
          setVerificationStatus('idle');
        }, 1500);
      } else {
        setVerificationStatus('error');
        setErrorMessage('Document non reconnu ou informations incorrectes. Veuillez vérifier vos données.');
      }
    } catch (error) {
      setVerificationStatus('error');
      setErrorMessage('Erreur lors de la vérification. Veuillez réessayer.');
    }
  };

  const handleSkip = () => {
    reset();
    setVerificationStatus('idle');
    setErrorMessage('');
    onSkip();
  };

  return (
    <ResponsiveModal open={open} maxWidth="md">
      <div className="px-6 py-4">
        <div className="flex flex-col items-center">
          <img src="/logo/vapo-logo-2.svg" alt="VapoStore Logo" className="my-4" />
          
          <div className="flex items-center gap-2 mb-4">
            <IdCard className="text-vapo-purple-primary w-6 h-6" />
            <span className="text-vapo-purple-primary text-xl font-semibold">
              VÉRIFICATION D'IDENTITÉ
            </span>
          </div>

          {verificationStatus === 'success' ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-green-600 mb-2">
                Vérification réussie !
              </p>
              <p className="text-sm text-gray-600">
                Votre identité a été confirmée avec succès.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-800 mb-6 text-center">
                Pour finaliser votre inscription, nous devons vérifier votre identité conformément à la réglementation française.
              </p>

              {verificationStatus === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 w-full">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de document
                  </label>
                  <Controller
                    name="documentType"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vapo-purple-primary focus:border-vapo-purple-primary"
                      >
                        <option value="cni">Carte Nationale d'Identité</option>
                        <option value="passport">Passeport</option>
                        <option value="license">Permis de conduire</option>
                      </select>
                    )}
                  />
                  {errors.documentType && (
                    <span className="text-red-500 text-xs mt-1">{errors.documentType.message}</span>
                  )}
                </div>

                <div>
                  <Controller
                    name="documentNumber"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          placeholder="Numéro du document"
                          className="mb-1"
                        />
                        {errors.documentNumber && (
                          <span className="text-red-500 text-xs mt-1">{errors.documentNumber.message}</span>
                        )}
                      </>
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          type="date"
                          placeholder="Date de naissance"
                          className="mb-1"
                        />
                        {errors.birthDate && (
                          <span className="text-red-500 text-xs mt-1">{errors.birthDate.message}</span>
                        )}
                      </>
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          placeholder="Code postal"
                          maxLength={5}
                          className="mb-1"
                        />
                        {errors.postalCode && (
                          <span className="text-red-500 text-xs mt-1">{errors.postalCode.message}</span>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <Button
                    type="submit"
                    variant="vapo"
                    className="py-3"
                    disabled={verificationStatus === 'loading'}
                  >
                    {verificationStatus === 'loading' ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size={16} />
                        Vérification en cours...
                      </div>
                    ) : (
                      'Vérifier mon identité'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="vapo-secondary"
                    className="py-3"
                    onClick={handleSkip}
                    disabled={verificationStatus === 'loading'}
                  >
                    Passer cette étape
                  </Button>
                </div>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Vos données sont sécurisées et utilisées uniquement pour la vérification d'identité.
              </p>
            </>
          )}
        </div>
      </div>
    </ResponsiveModal>
  );
}