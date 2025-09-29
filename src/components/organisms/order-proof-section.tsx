interface OrderProofSectionProps {
  proofs?: string[];
  className?: string;
  type?: 'text' | 'photos' | 'signature';
  signatureUrl?: string;
}

export default function OrderProofSection({ proofs = [], className = "", type = 'text', signatureUrl }: OrderProofSectionProps) {
  const hasProofs = proofs.length > 0 || !!signatureUrl;
  return (
    <div className={`bg-white rounded-2xl p-6 flex flex-col gap-2 ${className}`}>
      <div className="text-lg font-semibold mb-2">
        Preuves de livraison
        {type === 'photos' && (
          <span className="ml-2 text-vapo-purple-primary font-medium">: Photos</span>
        )}
        {type === 'signature' && (
          <span className="ml-2 text-vapo-purple-primary font-medium">: Signature</span>
        )}
      </div>
      {!hasProofs ? (
        <div className="text-gray-800 text-base">Aucune preuve de livraison car la livraison est toujours en cours.</div>
      ) : type === 'photos' ? (
        <div className="flex flex-row flex-wrap gap-4">
          {proofs.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Preuve de livraison ${idx + 1}`}
              className="w-32 h-32 object-cover rounded-xl border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      ) : type === 'signature' && signatureUrl ? (
        <div className="flex flex-col py-4 items-center">
          <img
            src={signatureUrl}
            alt="Signature de livraison"
            className="h-24 object-contain bg-white"
            style={{ maxWidth: '320px' }}
          />
        </div>
      ) : (
        <ul className="text-gray-800 text-base list-disc pl-5">
          {proofs.map((proof, idx) => (
            <li key={idx}>{proof}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
