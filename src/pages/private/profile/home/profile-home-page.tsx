
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { User, Lock, Settings } from 'lucide-react';

export default function ProfileHomePage() {
    return (
        <div className="min-h-screen   px-4 py-8 flex flex-col gap-10">

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <User className="text-vapo-purple-primary w-6 h-6" />
                    <span className="text-vapo-purple-primary text-xl font-bold">Profil de l'utilisateur</span>
                </div>
                <form className="flex flex-col gap-6">
                    <Input placeholder="John Doe" className=" border border-gray-300 text-white placeholder:text-gray-400" />
                    <Input placeholder="johndoe@gmail.com" className=" border border-gray-300 text-white placeholder:text-gray-400" />
                    <Input placeholder="+31 45 897 60" className=" border border-gray-300 text-white placeholder:text-gray-400" />
                    <div className="flex gap-4 mt-2">
                        <Button variant="vapo" className="flex-1">Enregistrer la modification</Button>
                        <Button variant="vapo" className="flex-1 opacity-50 cursor-not-allowed" disabled>Annuler</Button>
                    </div>
                </form>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Lock className="text-vapo-purple-primary w-6 h-6" />
                    <span className="text-vapo-purple-primary text-xl font-bold">Changer de mot de passe</span>
                </div>
                <form className="flex flex-col gap-6">
                    <Input placeholder="Nouveau mot de passe" type="password" className=" border border-gray-300 text-white placeholder:text-gray-400" />
                    <Input placeholder="Retapez le nouveau mot de passe" type="password" className=" border border-gray-300 text-white placeholder:text-gray-400" />
                    <div className="flex gap-4 mt-2">
                        <Button variant="vapo" className="flex-1">Changer le mot de passe</Button>
                        <Button variant="vapo" className="flex-1 opacity-50 cursor-not-allowed" disabled>Annuler</Button>
                    </div>
                </form>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Settings className="text-vapo-purple-primary w-6 h-6" />
                    <span className="text-vapo-purple-primary text-xl font-bold">Paramètre de l'application</span>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <span className="text-base">Option 1</span>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-base">Option 2</span>
                        <Switch checked />
                    </div>
                </div>
            </div>
        </div>
    );
}