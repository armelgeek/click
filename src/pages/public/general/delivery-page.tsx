import { useState } from 'react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Truck } from 'lucide-react';
import { useNavigate } from 'react-router';

const deliveryModes = [
    { label: 'Livraison express', value: 'express' },
    { label: 'Livraison planifiée', value: 'planifiee' },
];

const availableHours = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
];

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export default function DeliveryPage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'express' | 'planifiee'>('express');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState('');
    const [form, setForm] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        zip: '',
        country: '',
    });

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();

    return (
        <div className="min-h-screen flex flex-col gap-6 p-4">

            <div className="flex items-center justify-between">
                <Label icon={<Truck className="text-vapo-purple-primary w-5 h-5" />} className="text-vapo-purple-primary text-lg font-semibold mb-2">
                    Détail Livraison
                </Label>
                <Button variant="link" className="text-gray-500 text-sm underline px-0" onClick={() => navigate(-1)}>
                    Fermer
                </Button>
            </div>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-2">
                <div className="text-lg font-medium">Prix total</div>
                <div className="text-2xl font-bold">25.90 €</div>
            </div>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                <div className="text-lg font-semibold mb-1">Détail de la livraison</div>
                <div className="text-sm text-gray-700 mb-2">Veuillez remplir les informations en bas concernant l’adresse de livraison.</div>
                <div className="text-vapo-purple-primary font-semibold mb-1">Information client</div>
                <Input placeholder="Nom et prénom" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mb-2" />
                <Input placeholder="Téléphone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="mb-4" />
                <div className="text-vapo-purple-primary font-semibold mb-1">Adresse de livraison</div>
                <Input placeholder="Numéro de rue" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} className="mb-2" />
                <Input placeholder="Ville" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="mb-2" />
                <Input placeholder="Code postal" value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} className="mb-2" />
                <Input placeholder="Pays" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="mb-2" />
            </div>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                <div className="text-lg font-semibold mb-1">Choix de la livraison</div>
                <div className="text-sm text-gray-700 mb-2">Sélectionner l’option de livraison que vous voulez.</div>
                <div className="flex gap-8 mb-2">
                    {deliveryModes.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setMode(opt.value as 'express' | 'planifiee')}
                            className={`flex items-center gap-2 text-sm font-medium focus:outline-none ${mode === opt.value ? 'text-vapo-purple-primary' : 'text-gray-700'}`}
                        >
                            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${mode === opt.value ? 'border-vapo-purple-primary' : 'border-gray-300'}`}>
                                {mode === opt.value && <span className="w-3 h-3 bg-vapo-purple-primary rounded-full" />}
                            </span>
                            {opt.label}
                        </button>
                    ))}
                </div>
                {mode === 'express' && (
                    <div className="bg-vapo-purple-light-2/40 rounded-xl p-4 flex items-center gap-4">
                        <div>
                            <div className="font-semibold text-vapo-purple-primary mb-1">Livraison express</div>
                            <div className="text-sm text-vapo-purple-primary">La livraison express c’est une livraison le jour même, votre commande doit passé avant 17h.</div>
                        </div>
                    </div>
                )}
                {mode === 'planifiee' && (
                    <div>
                        <div className="font-semibold text-vapo-purple-primary mb-2">Choisissez les créneaux disponible.</div>
                        <div className="flex gap-8">
                            {/* Calendar */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <button onClick={() => setSelectedDate(new Date(year, month - 1, 1))} className="text-vapo-purple-primary">{'<'}</button>
                                    <span className="font-medium">Aout {year}</span>
                                    <button onClick={() => setSelectedDate(new Date(year, month + 1, 1))} className="text-vapo-purple-primary">{'>'}</button>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                                    <span>lun.</span><span>mar.</span><span>mer.</span><span>jeu.</span><span>ven.</span><span>sam.</span><span>dim.</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => <span key={i}></span>)}
                                    {Array.from({ length: days }).map((_, i) => {
                                        const d = i + 1;
                                        const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month;
                                        return (
                                            <button
                                                key={d}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-vapo-purple-primary text-white' : 'hover:bg-vapo-purple-light-2/40'}`}
                                                onClick={() => setSelectedDate(new Date(year, month, d))}
                                            >
                                                {d}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Hours */}
                            <div className="flex flex-col gap-2 ml-6">
                                <div className="font-medium mb-1">Heure disponible</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {availableHours.map(h => (
                                        <Button
                                            key={h}
                                            type="button"
                                            className={`border border-gray-400 text-xs font-medium ${selectedHour === h ? 'bg-vapo-purple-primary text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                                            onClick={() => setSelectedHour(h)}
                                        >
                                            {h}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Button variant="vapo" className="w-full h-14 text-lg font-semibold mt-2">Valider ma commande</Button>
        </div>
    );
}
