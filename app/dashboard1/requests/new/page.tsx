'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Stethoscope, Image as ImageIcon, Settings2, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import languagesData from '@/app/json/languages.json';
import countriesData from '@/app/json/countries.json';

interface Request {
  status: string;
  langue: string;
  patient_nom: string;
  patient_prenom: string;
  patient_email: string;
  patient_tel: string;
  patient_age: number;
  patient_sexe: string;
  patient_pays: string;
  patient_poids: string;
  patient_taille: string;
  patient_smoker: string;
  patient_imc: string;
  source: string;
  text_maladies: string;
  text_allergies: string;
  text_chirurgies: string;
  text_medicaments: string;
  id_procedure?: number;
  id_commercial?: number;
}

const STEPS = [
  { id: 'general', title: 'Général', icon: Settings2 },
  { id: 'patient', title: 'Patient', icon: User },
  { id: 'medical', title: 'Médical', icon: Stethoscope },
  { id: 'media', title: 'Documents', icon: ImageIcon },
];

export default function NewRequestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [patientMediaFiles, setPatientMediaFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [newRequest, setNewRequest] = useState<Partial<Request>>({
    status: 'New',
    langue: 'fr',
    patient_nom: '',
    patient_prenom: '',
    patient_email: '',
    patient_tel: '',
    patient_age: 0,
    patient_sexe: 'M',
    patient_pays: '',
    source: 'Manual',
    text_maladies: '',
    text_allergies: '',
    text_chirurgies: '',
    text_medicaments: '',
    patient_poids: '',
    patient_taille: '',
    patient_smoker: '',
    patient_imc: '',
  });

  useEffect(() => {
    fetch("https://pro.medotra.com/app/http/api/get_procedures.php").then(res => res.json()).then(data => { if (data.success) setProcedures(data.data); });
    fetch("https://pro.medotra.com/app/http/api/get_all_agents.php").then(res => res.json()).then(data => { if (data.success) setAgents(data.data); });
  }, []);

  const nextStep = () => currentStep < STEPS.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    if (!newRequest.patient_email || !newRequest.id_procedure) {
      alert("L'email et la procédure sont obligatoires.");
      setCurrentStep(0);
      return;
    }

    setLoading(true);

    try {
      const payload = { action: 'create', ...newRequest };
      console.log('📤 Payload envoyé:', payload);

      // ALERTE 1 : Ce qu'on envoie
      alert('📤 PAYLOAD ENVOYÉ:\n\n' + JSON.stringify(payload, null, 2));

      const res = await fetch('/api/send_request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('📋 Résultat:', result);

      // ALERTE 2 : Ce qu'on reçoit
      alert('📥 RÉPONSE REÇUE:\n\n' + JSON.stringify(result, null, 2));

      if (result.success && result.data?.success) {
        const idRequest = result.data?.id_request;
        const idPatient = result.data?.id_patient;

        console.log('🆔 IDs:', { idRequest, idPatient, filesCount: patientMediaFiles.length });

        // Upload photos si présents
        if (patientMediaFiles.length > 0 && idRequest && idPatient) {
          const uploadPromises = patientMediaFiles.map(async (file) => {
            const formData = new FormData();
            formData.append('type', 'patient_media');
            formData.append('entity_id', String(idPatient));
            formData.append('request_id', String(idRequest));
            formData.append('file', file);

            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            return await uploadRes.json();
          });

          const uploadResults = await Promise.all(uploadPromises);
          const failedUploads = uploadResults.filter(r => !r.success);

          if (failedUploads.length > 0) {
            alert(`⚠️ Requête créée !\n\nID Patient: ${idPatient}\nID Request: ${idRequest}\n\n⚠️ ${failedUploads.length} fichier(s) non uploadé(s).`);
          } else {
            alert(`✅ Succès !\n\nID Patient: ${idPatient}\nID Request: ${idRequest}\n\n📤 ${uploadResults.length} fichier(s) uploadé(s)!`);
          }
        } else {
          alert(`✅ Requête créée !\n\nID Patient: ${idPatient}\nID Request: ${idRequest}`);
        }

        router.push('/dashboard1/requests');
      } else {
        const errorMsg = result.data?.message || result.error || 'Erreur inconnue';
        alert(`❌ Erreur:\n\n${errorMsg}`);
      }
    } catch (err) {
      alert("❌ Erreur de connexion à l'API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header simple */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-all text-slate-500">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">Nouvelle Requête</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* CONTENEUR PRINCIPAL */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          
          {/* STEPPER HORIZONTAL */}
          <div className="relative flex justify-between p-8 bg-slate-50/50 border-b border-slate-100">
            {/* Ligne de progression en arrière-plan */}
            <div className="absolute top-[3.25rem] left-[15%] right-[15%] h-0.5 bg-slate-200">
                <div 
                    className="h-full bg-blue-600 transition-all duration-500" 
                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                ></div>
            </div>

            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === idx;
              const isCompleted = currentStep > idx;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-white text-slate-400 border-2 border-slate-100'
                  }`}>
                    {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                  </div>
                  <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ZONE DE FORMULAIRE */}
          <div className="p-10 min-h-[450px]">
            {currentStep === 0 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Procédure souhaitée *</label>
                    <select
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-4 rounded-2xl font-bold text-slate-700 outline-none transition-all"
                      value={newRequest.id_procedure || ''}
                      onChange={(e) => setNewRequest({ ...newRequest, id_procedure: Number(e.target.value) })}
                    >
                      <option value="">Choisir une option...</option>
                      {procedures.map((p) => <option key={p.id_procedure} value={p.id_procedure}>{p.nom_procedure}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Agent Responsable</label>
                    <select
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-4 rounded-2xl font-bold text-slate-700 outline-none transition-all"
                      value={newRequest.id_commercial || ''}
                      onChange={(e) => setNewRequest({ ...newRequest, id_commercial: Number(e.target.value) })}
                    >
                      <option value="">Non assigné</option>
                      {agents.map((a) => <option key={a.id_commercial} value={a.id_commercial}>{a.nom} {a.prenom}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Langue préférée</label>
                    <select
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-4 rounded-2xl font-bold text-slate-700 outline-none transition-all"
                      value={newRequest.langue || 'fr'}
                      onChange={(e) => setNewRequest({ ...newRequest, langue: e.target.value })}
                    >
                      {languagesData.languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.native_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Nom *</label>
                    <input className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                    value={newRequest.patient_nom} onChange={(e) => setNewRequest({...newRequest, patient_nom: e.target.value})} placeholder="Nom de famille" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Prénom</label>
                    <input className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                    value={newRequest.patient_prenom} onChange={(e) => setNewRequest({...newRequest, patient_prenom: e.target.value})} placeholder="Prénom" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Email de contact *</label>
                    <input type="email" className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                    value={newRequest.patient_email} onChange={(e) => setNewRequest({...newRequest, patient_email: e.target.value})} placeholder="email@adresse.com" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Âge</label>
                    <input type="number" className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                    value={newRequest.patient_age} onChange={(e) => setNewRequest({...newRequest, patient_age: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Genre</label>
                    <select className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                    value={newRequest.patient_sexe} onChange={(e) => setNewRequest({...newRequest, patient_sexe: e.target.value})}>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Poids (kg)</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                      value={newRequest.patient_poids} 
                      onChange={(e) => setNewRequest({...newRequest, patient_poids: e.target.value})} 
                      placeholder="Ex: 75" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Taille (cm)</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                      value={newRequest.patient_taille} 
                      onChange={(e) => setNewRequest({...newRequest, patient_taille: e.target.value})} 
                      placeholder="Ex: 175" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Fumeur</label>
                    <select 
                      className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                      value={newRequest.patient_smoker} 
                      onChange={(e) => setNewRequest({...newRequest, patient_smoker: e.target.value})}
                    >
                      <option value="">--</option>
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">IMC</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                      value={newRequest.patient_imc} 
                      onChange={(e) => setNewRequest({...newRequest, patient_imc: e.target.value})} 
                      placeholder="Ex: 24.5" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Pays</label>
                    <select
                      className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                      value={newRequest.patient_pays} 
                      onChange={(e) => setNewRequest({...newRequest, patient_pays: e.target.value})}
                    >
                      <option value="">-- Sélectionner un pays --</option>
                      {countriesData.countries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Téléphone</label>
                    <input 
                      className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all" 
                      value={newRequest.patient_tel} 
                      onChange={(e) => setNewRequest({...newRequest, patient_tel: e.target.value})} 
                      placeholder="+33 6 12 34 56 78" 
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                {['text_maladies', 'text_chirurgies', 'text_medicaments'].map((field) => (
                  <div key={field}>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block capitalize">
                        {field.replace('text_', '').replace('medicaments', 'médicaments & allergies')}
                    </label>
                    <textarea 
                        className="w-full bg-slate-50 p-4 rounded-2xl font-medium outline-none focus:bg-white border-2 border-transparent focus:border-blue-500/20 transition-all min-h-[100px]" 
                        value={(newRequest as any)[field]} 
                        onChange={(e) => setNewRequest({...newRequest, [field]: e.target.value})} 
                        placeholder="Précisez ici..."
                    />
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="border-4 border-dashed border-slate-50 rounded-[2.5rem] p-16 text-center group hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                    <input type="file" multiple onChange={(e) => e.target.files && setPatientMediaFiles(Array.from(e.target.files))} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <ImageIcon size={32} />
                    </div>
                    <h3 className="text-lg font-black text-slate-700">Déposer vos fichiers</h3>
                    <p className="text-slate-400 text-sm mt-2">Cliquez ou glissez-déposez vos photos/radios</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patientMediaFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 truncate">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ImageIcon size={16} /></div>
                                <span className="text-xs font-bold text-slate-600 truncate">{f.name}</span>
                            </div>
                            <button onClick={() => setPatientMediaFiles(patientMediaFiles.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 font-bold px-2">×</button>
                        </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* ACTIONS FOOTER */}
          <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
            <button 
              onClick={prevStep}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${currentStep === 0 ? 'invisible' : 'text-slate-400 hover:text-slate-800 hover:bg-white'}`}
            >
              <ChevronLeft size={16} /> Précédent
            </button>
            
            {currentStep < STEPS.length - 1 ? (
              <button 
                onClick={nextStep}
                className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all"
              >
                Suivant <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Traitement...' : 'Finaliser la Requête'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}