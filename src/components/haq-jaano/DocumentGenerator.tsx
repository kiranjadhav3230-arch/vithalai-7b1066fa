import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Copy, 
  Loader2,
  CheckCircle2,
  User,
  MapPin,
  Calendar,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SituationDetails } from '@/hooks/useHaqJaano';

interface DocumentGeneratorProps {
  situationDetails: SituationDetails | null;
  onBack: () => void;
  getLocalizedText: (item: Record<string, unknown>, field: string) => string;
}

interface FormData {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  accusedName: string;
  accusedDesignation: string;
  witnessDetails: string;
}

type DocumentType = 'complaint' | 'rti' | 'notice';

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  situationDetails,
  onBack,
  getLocalizedText,
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('complaint');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    incidentDate: '',
    incidentLocation: '',
    incidentDescription: '',
    accusedName: '',
    accusedDesignation: '',
    witnessDetails: '',
  });

  const getTitle = () => {
    switch (language) {
      case 'hi': return 'दस्तावेज़ जनरेटर';
      case 'mr': return 'दस्तऐवज जनरेटर';
      default: return 'Document Generator';
    }
  };

  const getDocTypes = () => ({
    complaint: {
      en: 'Complaint Letter',
      hi: 'शिकायत पत्र',
      mr: 'तक्रार पत्र',
    },
    rti: {
      en: 'RTI Application',
      hi: 'RTI आवेदन',
      mr: 'RTI अर्ज',
    },
    notice: {
      en: 'Legal Notice',
      hi: 'कानूनी नोटिस',
      mr: 'कायदेशीर नोटीस',
    },
  });

  const getLabels = () => {
    const labels = {
      fullName: { en: 'Full Name', hi: 'पूरा नाम', mr: 'पूर्ण नाव' },
      address: { en: 'Address', hi: 'पता', mr: 'पत्ता' },
      phone: { en: 'Phone Number', hi: 'फ़ोन नंबर', mr: 'फोन नंबर' },
      email: { en: 'Email', hi: 'ईमेल', mr: 'ईमेल' },
      incidentDate: { en: 'Date of Incident', hi: 'घटना की तारीख', mr: 'घटनेची तारीख' },
      incidentLocation: { en: 'Location of Incident', hi: 'घटना स्थान', mr: 'घटनेचे ठिकाण' },
      incidentDescription: { en: 'Describe what happened', hi: 'क्या हुआ बताएं', mr: 'काय घडले ते सांगा' },
      accusedName: { en: 'Accused/Respondent Name', hi: 'आरोपी का नाम', mr: 'आरोपीचे नाव' },
      accusedDesignation: { en: 'Designation/Position', hi: 'पद/पदनाम', mr: 'पद/हुद्दा' },
      witnessDetails: { en: 'Witness Details (Optional)', hi: 'गवाह विवरण (वैकल्पिक)', mr: 'साक्षीदार तपशील (ऐच्छिक)' },
      generate: { en: 'Generate Document', hi: 'दस्तावेज़ बनाएं', mr: 'दस्तऐवज तयार करा' },
      generating: { en: 'Generating...', hi: 'बना रहा है...', mr: 'तयार करत आहे...' },
      copy: { en: 'Copy to Clipboard', hi: 'कॉपी करें', mr: 'कॉपी करा' },
      download: { en: 'Download', hi: 'डाउनलोड', mr: 'डाउनलोड' },
      copied: { en: 'Copied!', hi: 'कॉपी हो गया!', mr: 'कॉपी झाले!' },
      yourDetails: { en: 'Your Details', hi: 'आपका विवरण', mr: 'तुमचा तपशील' },
      incidentDetails: { en: 'Incident Details', hi: 'घटना विवरण', mr: 'घटना तपशील' },
      accusedDetails: { en: 'Accused Details', hi: 'आरोपी विवरण', mr: 'आरोपी तपशील' },
    };
    return labels;
  };

  const labels = getLabels();
  const docTypes = getDocTypes();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.fullName || !formData.incidentDescription) {
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'कृपया नाम और घटना विवरण भरें' : 
                     language === 'mr' ? 'कृपया नाव आणि घटना तपशील भरा' : 
                     'Please fill in your name and incident description',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const situationTitle = situationDetails?.situation 
        ? getLocalizedText(situationDetails.situation as unknown as Record<string, unknown>, 'title')
        : '';

      const { data, error } = await supabase.functions.invoke('document-generator', {
        body: {
          documentType: selectedDocType,
          language,
          formData,
          situationTitle,
          situationDescription: situationDetails?.situation?.description_en || '',
          rights: situationDetails?.rights?.map(r => r.right_text_en) || [],
        },
      });

      if (error) throw error;

      setGeneratedDocument(data.document);
      toast({
        title: language === 'hi' ? 'सफल' : language === 'mr' ? 'यशस्वी' : 'Success',
        description: language === 'hi' ? 'दस्तावेज़ तैयार है' : 
                     language === 'mr' ? 'दस्तऐवज तयार आहे' : 
                     'Document generated successfully',
      });
    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'दस्तावेज़ बनाने में समस्या हुई' : 
                     language === 'mr' ? 'दस्तऐवज तयार करताना समस्या' : 
                     'Failed to generate document',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (generatedDocument) {
      await navigator.clipboard.writeText(generatedDocument);
      toast({
        title: labels.copied[language as keyof typeof labels.copied] || labels.copied.en,
      });
    }
  };

  const handleDownload = () => {
    if (generatedDocument) {
      const blob = new Blob([generatedDocument], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedDocType}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              {getTitle()}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Document Type Selection */}
        <Tabs value={selectedDocType} onValueChange={(v) => setSelectedDocType(v as DocumentType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="complaint" className="text-xs sm:text-sm">
              {docTypes.complaint[language as keyof typeof docTypes.complaint] || docTypes.complaint.en}
            </TabsTrigger>
            <TabsTrigger value="rti" className="text-xs sm:text-sm">
              {docTypes.rti[language as keyof typeof docTypes.rti] || docTypes.rti.en}
            </TabsTrigger>
            <TabsTrigger value="notice" className="text-xs sm:text-sm">
              {docTypes.notice[language as keyof typeof docTypes.notice] || docTypes.notice.en}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Situation Context */}
        {situationDetails?.situation && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-3 pt-4">
              <AlertTriangle className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {getLocalizedText(situationDetails.situation as unknown as Record<string, unknown>, 'title')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'hi' ? 'इस स्थिति के लिए दस्तावेज़' : 
                   language === 'mr' ? 'या परिस्थितीसाठी दस्तऐवज' : 
                   'Document for this situation'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!generatedDocument ? (
          <div className="space-y-6">
            {/* Your Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  {labels.yourDetails[language as keyof typeof labels.yourDetails] || labels.yourDetails.en}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      {labels.fullName[language as keyof typeof labels.fullName] || labels.fullName.en} *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {labels.phone[language as keyof typeof labels.phone] || labels.phone.en}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">
                    {labels.address[language as keyof typeof labels.address] || labels.address.en}
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    placeholder="..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {labels.email[language as keyof typeof labels.email] || labels.email.en}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Incident Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  {labels.incidentDetails[language as keyof typeof labels.incidentDetails] || labels.incidentDetails.en}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="incidentDate">
                      {labels.incidentDate[language as keyof typeof labels.incidentDate] || labels.incidentDate.en}
                    </Label>
                    <Input
                      id="incidentDate"
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incidentLocation">
                      {labels.incidentLocation[language as keyof typeof labels.incidentLocation] || labels.incidentLocation.en}
                    </Label>
                    <Input
                      id="incidentLocation"
                      value={formData.incidentLocation}
                      onChange={(e) => handleInputChange('incidentLocation', e.target.value)}
                      placeholder="..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incidentDescription">
                    {labels.incidentDescription[language as keyof typeof labels.incidentDescription] || labels.incidentDescription.en} *
                  </Label>
                  <Textarea
                    id="incidentDescription"
                    value={formData.incidentDescription}
                    onChange={(e) => handleInputChange('incidentDescription', e.target.value)}
                    rows={4}
                    placeholder="..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Accused Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4" />
                  {labels.accusedDetails[language as keyof typeof labels.accusedDetails] || labels.accusedDetails.en}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="accusedName">
                      {labels.accusedName[language as keyof typeof labels.accusedName] || labels.accusedName.en}
                    </Label>
                    <Input
                      id="accusedName"
                      value={formData.accusedName}
                      onChange={(e) => handleInputChange('accusedName', e.target.value)}
                      placeholder="..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accusedDesignation">
                      {labels.accusedDesignation[language as keyof typeof labels.accusedDesignation] || labels.accusedDesignation.en}
                    </Label>
                    <Input
                      id="accusedDesignation"
                      value={formData.accusedDesignation}
                      onChange={(e) => handleInputChange('accusedDesignation', e.target.value)}
                      placeholder="..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witnessDetails">
                    {labels.witnessDetails[language as keyof typeof labels.witnessDetails] || labels.witnessDetails.en}
                  </Label>
                  <Textarea
                    id="witnessDetails"
                    value={formData.witnessDetails}
                    onChange={(e) => handleInputChange('witnessDetails', e.target.value)}
                    rows={2}
                    placeholder="..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {labels.generating[language as keyof typeof labels.generating] || labels.generating.en}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  {labels.generate[language as keyof typeof labels.generate] || labels.generate.en}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Generated Document */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {docTypes[selectedDocType][language as keyof typeof docTypes.complaint] || docTypes[selectedDocType].en}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {language === 'hi' ? 'तैयार' : language === 'mr' ? 'तयार' : 'Ready'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                    {generatedDocument}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
                {labels.copy[language as keyof typeof labels.copy] || labels.copy.en}
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                {labels.download[language as keyof typeof labels.download] || labels.download.en}
              </Button>
            </div>

            {/* Generate Another */}
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setGeneratedDocument(null)}
            >
              {language === 'hi' ? 'नया दस्तावेज़ बनाएं' : 
               language === 'mr' ? 'नवीन दस्तऐवज तयार करा' : 
               'Generate Another Document'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
