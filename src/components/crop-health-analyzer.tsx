import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Upload, Camera, Loader2, Leaf, AlertCircle, CheckCircle, X, MessageSquare, Send, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LanguageSelector } from '@/components/ui/language-selector';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const cropTranslations = {
  en: {
    title: "🌱 Crop Health Assistant",
    subtitle: "AI-powered agricultural support",
    locationFeatureTitle: "Location-Based Analysis (Recommended for Regional Alerts)",
    locationFeatureInfo: "Enable location to receive regional pest alerts, seasonal care tips, and crop recommendations specific to your area's climate and conditions.",
    autoDetect: "Auto-Detect Location",
    enterLocation: "Or enter city/region",
    setButton: "Set",
    analyzeLocation: "Analyze Location",
    analyzingLocation: "Analyzing Location...",
    locationAnalysisTitle: "Location Analysis Results",
    regionalAlerts: "Regional Pest & Disease Alerts",
    imageAnalyzer: "Image Analyzer",
    chatWithAI: "Chat with AI",
    uploadTitle: "Upload Plant Image",
    uploadDesc: "Get AI-powered disease diagnosis and treatment recommendations",
    uploadText: "Upload Plant Image",
    dragDrop: "Click to browse or drag and drop your image here",
    maxSize: "Max 10MB • JPG, PNG, WEBP",
    chooseImage: "Choose Image",
    openCamera: "Open Camera",
    analyzeButton: "Analyze Crop",
    analyzing: "Analyzing...",
    clearImage: "Clear Image",
    analysisResult: "Analysis Results",
    suggestedQuestions: "Suggested Questions",
  },
  hi: {
    title: "🌱 फसल स्वास्थ्य सहायक",
    subtitle: "AI-संचालित कृषि सहायता",
    locationFeatureTitle: "स्थान-आधारित विश्लेषण (क्षेत्रीय अलर्ट के लिए अनुशंसित)",
    locationFeatureInfo: "अपने क्षेत्र की जलवायु और परिस्थितियों के अनुसार क्षेत्रीय कीट अलर्ट, मौसमी देखभाल युक्तियाँ और फसल की सिफारिशें प्राप्त करने के लिए स्थान सक्षम करें।",
    autoDetect: "स्वतः स्थान पता लगाएं",
    enterLocation: "या शहर/क्षेत्र दर्ज करें",
    setButton: "सेट करें",
    analyzeLocation: "स्थान का विश्लेषण करें",
    analyzingLocation: "स्थान का विश्लेषण हो रहा है...",
    locationAnalysisTitle: "स्थान विश्लेषण परिणाम",
    regionalAlerts: "क्षेत्रीय कीट और रोग अलर्ट",
    imageAnalyzer: "चित्र विश्लेषक",
    chatWithAI: "AI से चैट करें",
    uploadTitle: "पौधे की छवि अपलोड करें",
    uploadDesc: "AI-संचालित रोग निदान और उपचार सिफारिशें प्राप्त करें",
    uploadText: "पौधे की छवि अपलोड करें",
    dragDrop: "ब्राउज़ करने के लिए क्लिक करें या यहां अपनी छवि खींचें और छोड़ें",
    maxSize: "अधिकतम 10MB • JPG, PNG, WEBP",
    chooseImage: "छवि चुनें",
    openCamera: "कैमरा खोलें",
    analyzeButton: "फसल का विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है...",
    clearImage: "छवि हटाएं",
    analysisResult: "विश्लेषण परिणाम",
    suggestedQuestions: "सुझाए गए प्रश्न",
  },
  mr: {
    title: "🌱 पीक आरोग्य सहाय्यक",
    subtitle: "AI-संचालित कृषी सहाय्य",
    locationFeatureTitle: "स्थान-आधारित विश्लेषण (प्रादेशिक इशाऱ्यांसाठी शिफारस केलेले)",
    locationFeatureInfo: "तुमच्या क्षेत्राच्या हवामान आणि परिस्थितीनुसार प्रादेशिक कीटक इशारे, हंगामी काळजी टिपा आणि पीक शिफारसी मिळवण्यासाठी स्थान सक्षम करा।",
    autoDetect: "स्वयं स्थान शोधा",
    enterLocation: "किंवा शहर/प्रदेश प्रविष्ट करा",
    setButton: "सेट करा",
    analyzeLocation: "स्थान विश्लेषण करा",
    analyzingLocation: "स्थान विश्लेषण करत आहे...",
    locationAnalysisTitle: "स्थान विश्लेषण परिणाम",
    regionalAlerts: "प्रादेशिक कीटक आणि रोग इशारे",
    imageAnalyzer: "प्रतिमा विश्लेषक",
    chatWithAI: "AI शी चॅट करा",
    uploadTitle: "वनस्पती प्रतिमा अपलोड करा",
    uploadDesc: "AI-संचालित रोग निदान आणि उपचार शिफारसी मिळवा",
    uploadText: "वनस्पती प्रतिमा अपलोड करा",
    dragDrop: "ब्राउझ करण्यासाठी क्लिक करा किंवा येथे आपली प्रतिमा ड्रॅग आणि ड्रॉप करा",
    maxSize: "कमाल 10MB • JPG, PNG, WEBP",
    chooseImage: "प्रतिमा निवडा",
    openCamera: "कॅमेरा उघडा",
    analyzeButton: "पिकाचे विश्लेषण करा",
    analyzing: "विश्लेषण करत आहे...",
    clearImage: "प्रतिमा काढा",
    analysisResult: "विश्लेषण परिणाम",
    suggestedQuestions: "सुचवलेले प्रश्न",
  }
};

const suggestedQuestionsPool = {
  en: [
    ["What are common tomato diseases?", "How to prevent leaf curl?", "Best organic fertilizers?"],
    ["When to apply pesticides?", "How to improve soil health?", "Water requirements for wheat?"],
    ["Signs of nutrient deficiency?", "Pest control for cotton?", "Best planting season?"],
    ["How to increase crop yield?", "Organic farming tips?", "Disease-resistant varieties?"]
  ],
  hi: [
    ["टमाटर की सामान्य बीमारियां क्या हैं?", "पत्ती मुड़ने से कैसे रोकें?", "सर्वोत्तम जैविक उर्वरक?"],
    ["कीटनाशक कब लगाएं?", "मिट्टी का स्वास्थ्य कैसे सुधारें?", "गेहूं के लिए पानी की आवश्यकता?"],
    ["पोषक तत्व की कमी के संकेत?", "कपास के लिए कीट नियंत्रण?", "सर्वोत्तम रोपण का मौसम?"],
    ["फसल की पैदावार कैसे बढ़ाएं?", "जैविक खेती के सुझाव?", "रोग प्रतिरोधी किस्में?"]
  ],
  mr: [
    ["टोमॅटोचे सामान्य रोग काय आहेत?", "पाने वळण कसे टाळावे?", "सर्वोत्तम सेंद्रिय खते?"],
    ["कीटकनाशके कधी लावावी?", "मातीचे आरोग्य कसे सुधारावे?", "गव्हासाठी पाण्याची आवश्यकता?"],
    ["पोषक तत्वांच्या कमतरतेची चिन्हे?", "कापसासाठी कीटक नियंत्रण?", "सर्वोत्तम लागवड हंगाम?"],
    ["पीक उत्पन्न कसे वाढवावे?", "सेंद्रिय शेतीचे टिपा?", "रोग प्रतिरोधक जाती?"]
  ]
};

export const CropHealthAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  const [currentQuestionSet, setCurrentQuestionSet] = useState(0);
  
  // Location states
  const [location, setLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [regionalAlerts, setRegionalAlerts] = useState<string>('');
  const [locationAnalysis, setLocationAnalysis] = useState<string>('');
  const [isAnalyzingLocation, setIsAnalyzingLocation] = useState(false);
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load regional alerts when location changes
  useEffect(() => {
    if (location) {
      loadRegionalAlerts();
    }
  }, [location, language]);

  // Rotate suggested questions every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestionSet((prev) => (prev + 1) % suggestedQuestionsPool[language as keyof typeof suggestedQuestionsPool].length);
    }, 10000);
    return () => clearInterval(interval);
  }, [language]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${language}`
      );
      const data = await response.json();
      
      // Extract city/village name
      const cityName = data.address?.city || 
                       data.address?.town || 
                       data.address?.village || 
                       data.address?.county ||
                       data.address?.state ||
                       'Unknown Location';
      
      return cityName;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const getDeviceLocation = () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "❌ Not Supported",
        description: "Geolocation is not supported by your browser"
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Get city name from coordinates
        const cityName = await reverseGeocode(lat, lng);
        
        const loc = {
          lat,
          lng,
          name: cityName || undefined
        };
        setLocation(loc);
        
        // Set the city name in the manual input field
        if (cityName) {
          setManualLocation(cityName);
        }
        
        toast({
          title: "✅ Location Detected",
          description: `Location: ${cityName || 'Coordinates detected'}`
        });
        setIsGettingLocation(false);
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "❌ Location Error",
          description: "Could not get your location. Please enter manually."
        });
        setIsGettingLocation(false);
      }
    );
  };

  const handleManualLocation = () => {
    if (manualLocation.trim()) {
      setLocation({ lat: 0, lng: 0, name: manualLocation });
      toast({
        title: "✅ Location Set",
        description: "Location set manually"
      });
    }
  };

  const loadRegionalAlerts = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const season = currentMonth >= 6 && currentMonth <= 9 ? 'monsoon' : 
                     currentMonth >= 3 && currentMonth <= 5 ? 'summer' : 'winter';
      
      const prompt = `For ${location?.name || 'this region'} during ${season} season, list 3-4 common crop pests or diseases farmers should watch for. Be brief and specific.`;
      
      const { data, error } = await supabase.functions.invoke('crop-chat', {
        body: { 
          message: prompt,
          language,
          location,
          chatHistory: []
        }
      });

      if (error) throw error;
      setRegionalAlerts(data.response);
    } catch (error) {
      console.error('Error loading regional alerts:', error);
    }
  };

  const analyzeLocationInfo = async () => {
    if (!location) {
      toast({
        variant: "destructive",
        title: "❌ Location Required",
        description: "Please set your location first"
      });
      return;
    }

    setIsAnalyzingLocation(true);
    setLocationAnalysis("");

    try {
      const currentMonth = new Date().getMonth() + 1;
      const season = currentMonth >= 6 && currentMonth <= 9 ? 'monsoon' : 
                     currentMonth >= 3 && currentMonth <= 5 ? 'summer' : 'winter';

      const locationPrompt = `Provide a comprehensive agricultural analysis for ${location.name || `${location.lat}, ${location.lng}`} during ${season} season. Include:

1. **Climate & Soil**: Typical climate conditions and soil types in this region
2. **Recommended Crops**: Best crops to grow in this season
3. **Common Pests & Diseases**: Major agricultural pests and diseases prevalent in this area during ${season}
4. **Seasonal Care Tips**: Specific farming practices and care recommendations
5. **Water Management**: Irrigation recommendations based on seasonal rainfall
6. **Market Trends**: Popular crops and market demand in this region

Provide detailed, actionable information for farmers in this area. Format in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.`;

      const { data, error } = await supabase.functions.invoke('crop-chat', {
        body: { 
          message: locationPrompt,
          language,
          location,
          chatHistory: []
        }
      });

      if (error) throw error;

      setLocationAnalysis(data.response);
      toast({
        title: "✅ Analysis Complete",
        description: "Location analyzed successfully!"
      });
    } catch (error: any) {
      console.error('Error analyzing location:', error);
      toast({
        variant: "destructive",
        title: "❌ Analysis Failed",
        description: error.message || "Failed to analyze location"
      });
    } finally {
      setIsAnalyzingLocation(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 10MB"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crop-analyzer', {
        body: {
          image: selectedImage,
          language,
          location
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.analysis);
      toast({
        title: "✅ Analysis Complete",
        description: "Crop health analysis generated successfully"
      });
    } catch (error: any) {
      console.error('Error analyzing crop:', error);
      const errorMessage = error.message || "Failed to analyze crop image";
      toast({
        variant: "destructive",
        title: "❌ Analysis Failed",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysis(null);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    const newMessages: Message[] = [...chatMessages, { role: 'user', content: userMessage }];
    setChatMessages(newMessages);

    setChatLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crop-chat', {
        body: {
          message: userMessage,
          language,
          location,
          chatHistory: newMessages
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setChatMessages([...newMessages, { role: 'assistant', content: data.response }]);
      
      setTimeout(() => {
        chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);

    } catch (error: any) {
      console.error('Error in crop chat:', error);
      toast({
        variant: "destructive",
        title: "❌ Chat Error",
        description: error.message || "Failed to get response"
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  const t = cropTranslations[language as keyof typeof cropTranslations];
  const currentQuestions = suggestedQuestionsPool[language as keyof typeof suggestedQuestionsPool][currentQuestionSet];

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        <LanguageSelector language={language} onLanguageChange={setLanguage} />
      </div>

      {/* Location Feature Info */}
      <Card className="border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                {t.locationFeatureTitle}
              </h3>
              <p className="text-sm text-muted-foreground font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                {t.locationFeatureInfo}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Input */}
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={getDeviceLocation} 
                disabled={isGettingLocation}
                variant="outline"
                className="flex-1 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]"
              >
                {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
                {t.autoDetect}
              </Button>
              <div className="flex gap-2 flex-1">
                <Input 
                  placeholder={t.enterLocation}
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualLocation()}
                  className="font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]"
                />
                <Button onClick={handleManualLocation} variant="outline" className="font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">{t.setButton}</Button>
              </div>
            </div>
            
            {location && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                  📍 {location.name || manualLocation || `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`}
                </p>
                <Button
                  onClick={analyzeLocationInfo}
                  disabled={isAnalyzingLocation}
                  className="w-full gap-2"
                >
                  {isAnalyzingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.analyzingLocation}
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      {t.analyzeLocation}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location Analysis Results */}
      {locationAnalysis && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <h4 className="font-semibold text-green-800 dark:text-green-200 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                {t.locationAnalysisTitle}
              </h4>
            </div>
            <ScrollArea className="max-h-[400px]">
              <div className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                {locationAnalysis}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Regional Alerts */}
      {regionalAlerts && (
        <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
              <Leaf className="h-5 w-5 text-green-600" />
              {t.regionalAlerts}
            </h3>
            <p className="text-sm whitespace-pre-wrap font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">{regionalAlerts}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="analyzer" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="analyzer" className="flex items-center gap-2 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
            <Camera className="w-4 h-4" />
            {t.imageAnalyzer}
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
            <MessageSquare className="w-4 h-4" />
            {t.chatWithAI}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer" className="flex-1 flex flex-col gap-4 mt-0">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">{t.uploadTitle}</CardTitle>
          <CardDescription className="font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
            {t.uploadDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedImage ? (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium mb-2 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">{t.uploadText}</p>
                <p className="text-sm text-muted-foreground font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                  {t.dragDrop}
                </p>
                <Badge variant="secondary" className="mt-3 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                  {t.maxSize}
                </Badge>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]"
                  size="lg"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  {t.chooseImage}
                </Button>
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  variant="outline"
                  className="flex-1 border-green-500/50 hover:bg-green-500/10 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  {t.openCamera}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-primary/20">
                <img
                  src={selectedImage}
                  alt="Plant to analyze"
                  className="w-full max-h-96 object-contain bg-muted"
                />
                <Button
                  onClick={clearImage}
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={analyzeImage}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-5 w-5" />
                    {t.analyzeButton}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <Card className="flex-1 border-green-500/20 bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
              <CheckCircle className="w-5 h-5" />
              {t.analysisResult}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif] leading-relaxed">
                  {analysis}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {!selectedImage && !analysis && (
        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-medium">How to use:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Upload a clear image of the affected plant or leaf</li>
                  <li>Make sure the image is well-lit and focused</li>
                  <li>Include visible symptoms like discoloration, spots, or wilting</li>
                  <li>Wait for AI analysis with disease detection and treatment recommendations</li>
                  <li>Set your location for regional pest alerts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="chat" className="flex-1 flex flex-col gap-4 mt-0">
          <Card className="flex-1 flex flex-col border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                <MessageSquare className="w-5 w-5 text-green-600" />
                {language === 'hi' ? 'कृषि विशेषज्ञ चैट' : language === 'mr' ? 'कृषी तज्ञ चॅट' : 'Agricultural Expert Chat'}
              </CardTitle>
              <CardDescription className="font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                {language === 'hi' ? 'फसल रोग, पोषक तत्व, खेती प्रथाओं और अधिक के बारे में प्रश्न पूछें' :
                 language === 'mr' ? 'पीक रोग, पोषक तत्वे, शेती पद्धती आणि अधिक बद्दल प्रश्न विचारा' :
                 'Ask questions about crop diseases, nutrients, farming practices, and more'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
              <ScrollArea className="flex-1 pr-4" ref={chatScrollRef}>
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="p-4 bg-green-100 dark:bg-green-950 rounded-full mb-4">
                      <Leaf className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                      {language === 'hi' ? 'बातचीत शुरू करें' : language === 'mr' ? 'संवाद सुरू करा' : 'Start a conversation'}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-4 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                      {language === 'hi' ? 'पौधों के रोग, पोषक तत्व की कमी, कीट नियंत्रण, जैविक खेती, मिट्टी स्वास्थ्य, या किसी भी कृषि विषय के बारे में मुझसे पूछें!' :
                       language === 'mr' ? 'वनस्पती रोग, पोषक तत्वांची कमतरता, कीड नियंत्रण, सेंद्रिय शेती, माती आरोग्य, किंवा कोणत्याही कृषी विषयाबद्दल मला विचारा!' :
                       'Ask me about plant diseases, nutrient deficiencies, pest control, organic farming, soil health, or any agricultural topic!'}
                    </p>
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">{t.suggestedQuestions}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                      {currentQuestions.map((question, idx) => (
                        <Button 
                          key={idx}
                          variant="outline" 
                          className="justify-start text-left h-auto py-3 border-green-500/30 font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]"
                          onClick={() => setChatInput(question)}
                        >
                          <span className="text-xs">💡 {question}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === 'user' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <div className="flex gap-2">
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    language === 'hi' ? 'अपना प्रश्न पूछें...' :
                    language === 'mr' ? 'तुमचा प्रश्न विचारा...' :
                    'Ask your agricultural question...'
                  }
                  className="min-h-[60px] resize-none font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]"
                  disabled={chatLoading}
                />
                <Button 
                  onClick={handleChatSend} 
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
