import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Loader2, Leaf, AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

export const CropHealthAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

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
          language: language
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

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">🌱 Crop Health Analyzer</CardTitle>
              <CardDescription>
                Upload plant/leaf images for AI-powered disease diagnosis and treatment recommendations
              </CardDescription>
            </div>
          </div>
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
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
