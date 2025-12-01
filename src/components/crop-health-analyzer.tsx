import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Upload, Camera, Loader2, Leaf, AlertCircle, CheckCircle, X, MessageSquare, Send, MapPin, Wifi, WifiOff, CloudUpload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LanguageSelector } from '@/components/ui/language-selector';
import { 
  savePendingAnalysis, 
  getAllPendingAnalyses, 
  deletePendingAnalysis,
  type PendingAnalysis 
} from '@/utils/offlineStorage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const CropHealthAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  
  // Location states
  const [location, setLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [regionalAlerts, setRegionalAlerts] = useState<string>('');
  
  // Offline states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingPhotos, setPendingPhotos] = useState<PendingAnalysis[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "✅ Back Online",
        description: "Processing queued photos..."
      });
      processQueuedPhotos();
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "📵 Offline Mode",
        description: "Photos will be queued for later analysis"
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    loadPendingPhotos();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load regional alerts when location changes
  useEffect(() => {
    if (location) {
      loadRegionalAlerts();
    }
  }, [location, language]);

  const loadPendingPhotos = async () => {
    try {
      const pending = await getAllPendingAnalyses();
      setPendingPhotos(pending);
    } catch (error) {
      console.error('Error loading pending photos:', error);
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
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(loc);
        toast({
          title: "✅ Location Detected",
          description: "Successfully detected your location"
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

  const processQueuedPhotos = async () => {
    if (isProcessingQueue || pendingPhotos.length === 0) return;
    
    setIsProcessingQueue(true);
    const results = [];
    
    for (const pending of pendingPhotos) {
      try {
        const { data, error } = await supabase.functions.invoke('crop-analyzer', {
          body: { 
            image: pending.image, 
            language: pending.language,
            location: pending.location
          }
        });

        if (error) throw error;
        
        results.push({ id: pending.id, success: true });
        await deletePendingAnalysis(pending.id);
      } catch (error) {
        results.push({ id: pending.id, success: false });
      }
    }
    
    await loadPendingPhotos();
    setIsProcessingQueue(false);
    
    const successCount = results.filter(r => r.success).length;
    if (successCount > 0) {
      toast({
        title: "✅ Queue Processed",
        description: `Analyzed ${successCount} queued photo(s)`
      });
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

    // If offline, queue the photo
    if (!isOnline) {
      try {
        const pending: PendingAnalysis = {
          id: Date.now().toString(),
          image: selectedImage,
          language,
          location: location || undefined,
          timestamp: Date.now()
        };
        
        await savePendingAnalysis(pending);
        await loadPendingPhotos();
        toast({
          title: "📵 Queued for Later",
          description: "Photo saved for analysis when you're back online"
        });
        clearImage();
        return;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "❌ Failed to Save",
          description: "Could not save photo offline"
        });
        return;
      }
    }

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

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">🌱 Crop Health Assistant</h1>
            <p className="text-sm text-muted-foreground">AI-powered agricultural support</p>
          </div>
          {!isOnline && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          )}
          {isOnline && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          )}
        </div>
        <LanguageSelector language={language} onLanguageChange={setLanguage} />
      </div>

      {/* Location Input */}
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Location (Recommended for Regional Alerts)</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={getDeviceLocation} 
              disabled={isGettingLocation}
              variant="outline"
              className="flex-1"
            >
              {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
              Auto-Detect Location
            </Button>
            <div className="flex gap-2 flex-1">
              <Input 
                placeholder="Or enter city/region"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualLocation()}
              />
              <Button onClick={handleManualLocation} variant="outline">Set</Button>
            </div>
          </div>
          {location && (
            <p className="text-sm text-muted-foreground mt-2">
              📍 {location.name || `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Regional Alerts */}
      {regionalAlerts && (
        <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Regional Pest & Disease Alerts
            </h3>
            <p className="text-sm whitespace-pre-wrap font-['Noto_Sans',_'Noto_Sans_Devanagari',_sans-serif]">{regionalAlerts}</p>
          </CardContent>
        </Card>
      )}

      {/* Queued Photos */}
      {pendingPhotos.length > 0 && (
        <Card className="border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <CloudUpload className="h-5 w-5 text-orange-500" />
                Queued Photos ({pendingPhotos.length}/5)
              </h3>
              {isOnline && (
                <Button 
                  size="sm" 
                  onClick={processQueuedPhotos}
                  disabled={isProcessingQueue}
                >
                  {isProcessingQueue ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Process Now
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isOnline ? 'Photos will be analyzed automatically' : 'Photos will be analyzed when you\'re back online'}
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="analyzer" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="analyzer" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Image Analyzer
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat with AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer" className="flex-1 flex flex-col gap-4 mt-0">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Upload Plant Image</CardTitle>
          <CardDescription>
            Get AI-powered disease diagnosis and treatment recommendations
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
                <p className="text-lg font-medium mb-2">Upload Plant Image</p>
                <p className="text-sm text-muted-foreground">
                  Click to browse or drag and drop your image here
                </p>
                <Badge variant="secondary" className="mt-3">
                  Max 10MB • JPG, PNG, WEBP
                </Badge>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  size="lg"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Choose Image
                </Button>
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  variant="outline"
                  className="flex-1 border-green-500/50 hover:bg-green-500/10"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Take Photo
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
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Plant Health...
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-5 w-5" />
                    Analyze Crop Health
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
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              Analysis Results
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
                  <li>Offline? Photos will be queued automatically</li>
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
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 w-5 text-green-600" />
                Agricultural Expert Chat
              </CardTitle>
              <CardDescription>
                Ask questions about crop diseases, nutrients, farming practices, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
              <ScrollArea className="flex-1 pr-4" ref={chatScrollRef}>
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="p-4 bg-green-100 dark:bg-green-950 rounded-full mb-4">
                      <Leaf className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Ask me about plant diseases, nutrient deficiencies, pest control, organic farming, soil health, or any agricultural topic!
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-2 w-full max-w-md">
                      <Button 
                        variant="outline" 
                        className="justify-start text-left h-auto py-3 border-green-500/30"
                        onClick={() => setChatInput(language === 'hi' ? 'मेरी फसल की पत्तियाँ पीली हो रही हैं, क्या करूँ?' : language === 'mr' ? 'माझ्या पिकाची पाने पिवळी होत आहेत, काय करावे?' : 'My crop leaves are turning yellow, what should I do?')}
                      >
                        <span className="text-xs">💡 {language === 'hi' ? 'मेरी फसल की पत्तियाँ पीली हो रही हैं...' : language === 'mr' ? 'माझ्या पिकाची पाने पिवळी होत आहेत...' : 'My crop leaves are turning yellow...'}</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start text-left h-auto py-3 border-green-500/30"
                        onClick={() => setChatInput(language === 'hi' ? 'जैविक खेती के लिए क्या करें?' : language === 'mr' ? 'सेंद्रिय शेतीसाठी काय करावे?' : 'How do I start organic farming?')}
                      >
                        <span className="text-xs">🌿 {language === 'hi' ? 'जैविक खेती के बारे में...' : language === 'mr' ? 'सेंद्रिय शेतीबद्दल...' : 'About organic farming...'}</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start text-left h-auto py-3 border-green-500/30"
                        onClick={() => setChatInput(language === 'hi' ? 'कीट नियंत्रण के लिए घरेलू उपाय?' : language === 'mr' ? 'कीड नियंत्रणासाठी घरगुती उपाय?' : 'Home remedies for pest control?')}
                      >
                        <span className="text-xs">🐛 {language === 'hi' ? 'कीट नियंत्रण उपाय...' : language === 'mr' ? 'कीड नियंत्रण उपाय...' : 'Pest control remedies...'}</span>
                      </Button>
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
