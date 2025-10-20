'use client';

import { useState } from 'react';
import { translations, type Language } from '@/lib/translations';

interface QuestionnaireData {
  language: Language;
  profile: string;
  profession: string;
  rdv_method: string;
  time_rdv: number;
  time_relance: number;
  time_devis: number;
  pain_points: string[];
  tools: string[];
  features: string[];
  price: string;
  objections: string;
  first_name: string;
  company: string;
  phone: string;
  email: string;
}

export default function QuestionnairePage() {
  const [language, setLanguage] = useState<Language>('fr');
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<QuestionnaireData>>({
    language: 'fr'
  });

  const t = translations[language];
  const totalSteps = t.questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleRadioChange = (fieldId: string, value: string) => {
    setFormData({ ...formData, [fieldId]: value });
  };

  const handleCheckboxChange = (fieldId: string, value: string, isChecked: boolean) => {
    const current = formData[fieldId as keyof QuestionnaireData] as string[] || [];
    if (isChecked) {
      setFormData({ ...formData, [fieldId]: [...current, value] });
    } else {
      setFormData({ ...formData, [fieldId]: current.filter(item => item !== value) });
    }
  };

  const handleTextChange = (fieldId: string, value: string) => {
    setFormData({ ...formData, [fieldId]: value });
  };

  const handleNumberChange = (fieldId: string, value: string) => {
    setFormData({ ...formData, [fieldId]: value ? parseInt(value) : 0 });
  };

  const isStepValid = () => {
    const question = t.questions[currentStep];
    
    if ('options' in question && question.options) {
      const values = formData[question.id as keyof QuestionnaireData];
      if (question.id === 'pain_points' || question.id === 'tools' || question.id === 'features') {
        return values && Array.isArray(values) && values.length > 0;
      } else {
        return !!values;
      }
    } else if (question.id === 'time') {
      return (
        formData.time_rdv !== undefined &&
        formData.time_relance !== undefined &&
        formData.time_devis !== undefined
      );
    } else if (question.id === 'objections') {
      return !!formData.objections?.trim();
    } else if (question.id === 'contact') {
      return (
        !!formData.first_name?.trim() &&
        !!formData.phone?.trim() &&
        !!formData.email?.trim()
      );
    }
    return true;
  };

  const handleNext = () => {
    if (isStepValid() && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/submit-questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          language,
          submitted_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(language === 'fr' ? 'Erreur lors de l\'envoi. Veille réessayer.' : 'Error sending. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const question = t.questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Language Switcher */}
        {!showSuccess && (
          <div className="flex justify-end gap-2 p-4 bg-gray-50 border-b">
            <button
              onClick={() => {
                setLanguage('fr');
                setCurrentStep(0);
              }}
              className={`px-4 py-2 rounded font-medium transition ${
                language === 'fr'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Français
            </button>
            <button
              onClick={() => {
                setLanguage('en');
                setCurrentStep(0);
              }}
              className={`px-4 py-2 rounded font-medium transition ${
                language === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              English
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-700 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{t.header.title}</h1>
          <p className="opacity-90">{t.header.subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {!showSuccess ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{question.title}</h3>
                {question.desc && <p className="text-gray-600 mb-4">{question.desc}</p>}

                {/* Radio Options */}
                {'options' in question && question.id !== 'pain_points' && question.id !== 'tools' && question.id !== 'features' && (
                  <div className="space-y-3">
                    {question.options?.map((option: any) => (
                      <label
                        key={option.value}
                        className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={formData[question.id as keyof QuestionnaireData] === option.value}
                          onChange={(e) => handleRadioChange(question.id, e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">{option.label}</p>
                          {('desc' in option && option.desc) && <p className="text-sm text-gray-600">{option.desc}</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Checkbox Options */}
                {(question.id === 'pain_points' || question.id === 'tools' || question.id === 'features') && (
                  <div className="space-y-3">
                    {question.options?.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition"
                      >
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={(formData[question.id as keyof QuestionnaireData] as string[])?.includes(option.value) || false}
                          onChange={(e) => handleCheckboxChange(question.id, option.value, e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">{option.label}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Time Inputs */}
                {question.id === 'time' && 'fields' in question && (
                  <div className="space-y-4">
                    {question.fields?.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={formData[field.key as keyof QuestionnaireData] || ''}
                          onChange={(e) => handleNumberChange(field.key, e.target.value)}
                          placeholder={question.placeholder}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Textarea */}
                {question.id === 'objections' && (
                  <textarea
                    value={formData.objections || ''}
                    onChange={(e) => handleTextChange('objections', e.target.value)}
                    placeholder={question.placeholder}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none min-h-[100px]"
                  />
                )}

                {/* Contact Fields */}
                {question.id === 'contact' && 'fields' in question && (
                  <div className="space-y-4">
                    {question.fields?.map((field: any) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label} {('required' in field && field.required) && '*'}
                        </label>
                        <input
                          type={field.key === 'email' ? 'email' : field.key === 'phone' ? 'tel' : 'text'}
                          value={formData[field.key as keyof QuestionnaireData] || ''}
                          onChange={(e) => handleTextChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-4 mb-4">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition"
                  >
                    {t.buttons.previous}
                  </button>
                )}

                {currentStep < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="ml-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-medium rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.buttons.next}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepValid() || loading}
                    className="ml-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-medium rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (language === 'fr' ? 'Envoi...' : 'Sending...') : t.buttons.submit}
                  </button>
                )}
              </div>

              {/* Step Counter */}
              <p className="text-center text-sm text-gray-600">
                {currentStep + 1} {t.stepCounter} {totalSteps}
              </p>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                {t.success.title}
              </h2>
              <p className="text-gray-600 mb-2">
                {t.success.message}
              </p>
              <p className="text-gray-600 mb-4">
                {t.success.follow}
              </p>
              <p className="text-sm text-gray-500">{t.success.closing}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}