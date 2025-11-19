import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentAnalyzerProps {
  user: any;
}

export const DocumentAnalyzer: React.FC<DocumentAnalyzerProps> = ({ user }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState<Array<{question: string, answer: string, references: string[], confidence: string}>>([]);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document record to database
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title: file.name,
          file_url: uploadData.path,
          file_size: file.size,
          analysis_status: 'pending'
        })
        .select()
        .single();

      if (docError) throw docError;

      // Read file content for analysis
      const fileText = await readPDFContent(file);
      
      setIsAnalyzing(true);
      
      // Analyze document
      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('document-analyzer', {
          body: {
            documentId: docData.id,
            documentText: fileText
          }
        });

      if (analysisError) throw analysisError;

      toast({
        title: "Document analyzed successfully!",
        description: "Your document has been processed and is ready for review."
      });

      loadDocuments();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload and analyze document.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const readPDFContent = async (file: File): Promise<string> => {
    // Simple text extraction - in production, you'd want to use a proper PDF parser
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // This is a simplified approach - actual PDF parsing would require a library
        resolve(file.name + " content would be extracted here");
      };
      reader.readAsText(file);
    });
  };

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error loading documents",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  React.useEffect(() => {
    loadDocuments();
  }, [user]);

  const handleAskQuestion = async () => {
    if (!question.trim() || !selectedDocument) return;

    setIsAsking(true);
    try {
      const { data, error } = await supabase.functions.invoke('document-qa', {
        body: {
          documentId: selectedDocument.id,
          question: question.trim()
        }
      });

      if (error) throw error;

      if (data.success) {
        setQaHistory([...qaHistory, {
          question: data.question,
          answer: data.answer,
          references: data.references || [],
          confidence: data.confidence || 'medium'
        }]);
        setQuestion('');
        toast({
          title: "Answer generated!",
          description: "Your question has been answered based on the document."
        });
      }
    } catch (error: any) {
      console.error('Error asking question:', error);
      toast({
        title: "Failed to get answer",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAsking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'analyzing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Document Analyzer
        </h2>
        <p className="text-muted-foreground mt-2">
          Upload PDF documents for AI-powered analysis and insights
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload a PDF file to get AI-powered analysis, summaries, and study materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Drop your PDF file here or click to browse
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading || isAnalyzing}
                className="hidden"
                id="file-upload"
              />
              <Button 
                asChild 
                disabled={isUploading || isAnalyzing}
                className="mt-4"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Select PDF File
                    </>
                  )}
                </label>
              </Button>
            </div>
          </div>

          {(isUploading || isAnalyzing) && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{isUploading ? 'Uploading document...' : 'Analyzing with AI...'}</span>
                <span>{isUploading ? '50%' : '75%'}</span>
              </div>
              <Progress value={isUploading ? 50 : 75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>
              Recently uploaded and analyzed documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedDocument?.id === doc.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => {
                      setSelectedDocument(doc);
                      setQaHistory([]);
                      setQuestion('');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.analysis_status)}
                        <span className="font-medium text-sm truncate">
                          {doc.title}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.analysis_status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {documents.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No documents uploaded yet
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-generated insights and study materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDocument && selectedDocument.analysis_result ? (
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                  <TabsTrigger value="qa">Q&A</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Document Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedDocument.analysis_result.summary || 'Summary not available'}
                    </p>
                  </div>
                  
                  {selectedDocument.analysis_result.mainPoints && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Points</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedDocument.analysis_result.mainPoints.map((point: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="questions" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Study Questions</h4>
                    <div className="space-y-2">
                      {selectedDocument.analysis_result.studyQuestions?.map((question: string, index: number) => (
                        <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                          <span className="font-medium text-primary">{index + 1}.</span> {question}
                        </div>
                      )) || <p className="text-muted-foreground">No questions generated</p>}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="topics" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Topics</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedDocument.analysis_result.keyTopics?.map((topic: string, index: number) => (
                        <Badge key={index} variant="secondary">{topic}</Badge>
                      )) || <p className="text-muted-foreground">No topics identified</p>}
                    </div>
                  </div>

                  {selectedDocument.analysis_result.definitions && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Definitions</h4>
                      <div className="space-y-2">
                        {selectedDocument.analysis_result.definitions.map((def: any, index: number) => (
                          <div key={index} className="p-2 bg-muted/50 rounded">
                            <span className="font-medium text-sm">{def.term}:</span>
                            <p className="text-sm text-muted-foreground mt-1">{def.definition}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="qa" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Ask Questions About This Document
                      </h4>
                      <p className="text-xs text-muted-foreground mb-4">
                        Get AI-powered answers with references from the document
                      </p>
                    </div>

                    {/* Q&A History */}
                    <ScrollArea className="h-64 border rounded-lg p-3">
                      {qaHistory.length > 0 ? (
                        <div className="space-y-4">
                          {qaHistory.map((qa, index) => (
                            <div key={index} className="space-y-2">
                              <div className="bg-primary/10 p-3 rounded-lg">
                                <p className="text-sm font-medium">Q: {qa.question}</p>
                              </div>
                              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                                <p className="text-sm">{qa.answer}</p>
                                {qa.references.length > 0 && (
                                  <div className="pt-2 border-t">
                                    <p className="text-xs font-semibold mb-1">References:</p>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                      {qa.references.map((ref, idx) => (
                                        <li key={idx}>• {ref}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  Confidence: {qa.confidence}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                          No questions asked yet. Type your question below!
                        </div>
                      )}
                    </ScrollArea>

                    {/* Question Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question about this document..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isAsking) {
                            handleAskQuestion();
                          }
                        }}
                        disabled={isAsking || !selectedDocument.document_text}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAskQuestion}
                        disabled={isAsking || !question.trim() || !selectedDocument.document_text}
                        size="icon"
                      >
                        {isAsking ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {!selectedDocument.document_text && (
                      <p className="text-xs text-amber-600">
                        Document content not available. Please re-upload this document to enable Q&A.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {selectedDocument ? 'Analysis in progress...' : 'Select a document to view analysis'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};