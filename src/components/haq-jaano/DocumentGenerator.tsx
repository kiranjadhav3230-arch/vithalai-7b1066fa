import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DocumentGeneratorProps {
  situationTitle?: string;
  documentType: 'complaint' | 'rti' | 'legal_notice';
  onBack: () => void;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  situationTitle,
  documentType,
  onBack,
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    incident_date: '',
    incident_location: '',
    description: '',
    accused_name: '',
    department: '',
  });

  const getTitle = () => {
    const titles = {
      complaint: { en: 'Generate Complaint Letter', hi: 'शिकायत पत्र बनाएं', mr: 'तक्रार पत्र तयार करा' },
      rti: { en: 'Generate RTI Application', hi: 'RTI आवेदन बनाएं', mr: 'RTI अर्ज तयार करा' },
      legal_notice: { en: 'Generate Legal Notice', hi: 'कानूनी नोटिस बनाएं', mr: 'कायदेशीर नोटीस तयार करा' },
    };
    return titles[documentType][language as 'en' | 'hi' | 'mr'] || titles[documentType].en;
  };

  const getLabels = () => {
    const labels = {
      name: { en: 'Your Full Name', hi: 'आपका पूरा नाम', mr: 'तुमचे पूर्ण नाव' },
      address: { en: 'Your Address', hi: 'आपका पता', mr: 'तुमचा पत्ता' },
      phone: { en: 'Phone Number', hi: 'फोन नंबर', mr: 'फोन नंबर' },
      incident_date: { en: 'Date of Incident', hi: 'घटना की तारीख', mr: 'घटनेची तारीख' },
      incident_location: { en: 'Location of Incident', hi: 'घटना का स्थान', mr: 'घटनेचे ठिकाण' },
      description: { en: 'Describe the Issue', hi: 'समस्या का वर्णन करें', mr: 'समस्येचे वर्णन करा' },
      accused_name: { en: 'Name of Accused/Department', hi: 'आरोपी/विभाग का नाम', mr: 'आरोपी/विभागाचे नाव' },
      department: { en: 'Department to Address', hi: 'संबोधित विभाग', mr: 'संबोधित विभाग' },
    };
    return Object.fromEntries(
      Object.entries(labels).map(([key, val]) => [key, val[language as 'en' | 'hi' | 'mr'] || val.en])
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDocument = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'कृपया नाम और विवरण भरें' : 
                     language === 'mr' ? 'कृपया नाव आणि वर्णन भरा' : 
                     'Please fill in name and description',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('haq-jaano-ai', {
        body: {
          query: `Generate a formal ${documentType === 'complaint' ? 'complaint letter' : documentType === 'rti' ? 'RTI application' : 'legal notice'} in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'} for the following situation:
          
Situation: ${situationTitle || 'General complaint'}
Complainant Name: ${formData.name}
Address: ${formData.address}
Phone: ${formData.phone}
Date of Incident: ${formData.incident_date}
Location: ${formData.incident_location}
Description: ${formData.description}
Against: ${formData.accused_name}
Department: ${formData.department}

Please generate a professional, legally appropriate document that can be submitted to authorities. Include proper formatting, date, subject line, and all necessary details.`,
          language,
          type: 'document_generation',
        },
      });

      if (error) throw error;
      setGeneratedDocument(data.response || data.text || '');
    } catch (error) {
      console.error('Document generation error:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'दस्तावेज़ बनाने में त्रुटि' : 
                     language === 'mr' ? 'दस्तऐवज तयार करताना त्रुटी' : 
                     'Error generating document',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedDocument);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: language === 'hi' ? 'कॉपी हो गया' : language === 'mr' ? 'कॉपी झाले' : 'Copied',
      description: language === 'hi' ? 'दस्तावेज़ क्लिपबोर्ड पर कॉपी हो गया' : 
                   language === 'mr' ? 'दस्तऐवज क्लिपबोर्डवर कॉपी झाले' : 
                   'Document copied to clipboard',
    });
  };

  const downloadDocument = () => {
    const blob = new Blob([generatedDocument], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentType}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const labels = getLabels();

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">{getTitle()}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {!generatedDocument ? (
          <>
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{labels.name} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={labels.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{labels.phone}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder={labels.phone}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{labels.address}</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={labels.address}
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="incident_date">{labels.incident_date}</Label>
                  <Input
                    id="incident_date"
                    type="date"
                    value={formData.incident_date}
                    onChange={(e) => handleInputChange('incident_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident_location">{labels.incident_location}</Label>
                  <Input
                    id="incident_location"
                    value={formData.incident_location}
                    onChange={(e) => handleInputChange('incident_location', e.target.value)}
                    placeholder={labels.incident_location}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accused_name">{labels.accused_name}</Label>
                  <Input
                    id="accused_name"
                    value={formData.accused_name}
                    onChange={(e) => handleInputChange('accused_name', e.target.value)}
                    placeholder={labels.accused_name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{labels.department}</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder={labels.department}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{labels.description} *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={labels.description}
                  rows={5}
                />
              </div>
            </div>

            <Button 
              className="w-full gap-2" 
              size="lg" 
              onClick={generateDocument}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {language === 'hi' ? 'बना रहा है...' : language === 'mr' ? 'तयार करत आहे...' : 'Generating...'}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  {language === 'hi' ? 'दस्तावेज़ बनाएं' : language === 'mr' ? 'दस्तऐवज तयार करा' : 'Generate Document'}
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Generated Document */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                {generatedDocument}
              </pre>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 gap-2" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {language === 'hi' ? 'कॉपी करें' : language === 'mr' ? 'कॉपी करा' : 'Copy'}
              </Button>
              <Button className="flex-1 gap-2" onClick={downloadDocument}>
                <Download className="h-4 w-4" />
                {language === 'hi' ? 'डाउनलोड करें' : language === 'mr' ? 'डाउनलोड करा' : 'Download'}
              </Button>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setGeneratedDocument('')}>
              {language === 'hi' ? 'नया दस्तावेज़ बनाएं' : language === 'mr' ? 'नवीन दस्तऐवज तयार करा' : 'Generate New Document'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
