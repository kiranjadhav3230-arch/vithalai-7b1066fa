import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Rocket,
  AlertCircle 
} from 'lucide-react';

interface WebsiteProject {
  id: string;
  name: string;
  description: string | null;
  files: {
    id: string;
    file_name: string;
    file_content: string;
    language: string;
  }[];
}

interface PublishNetlifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: WebsiteProject | null;
  onSuccess?: (url: string) => void;
}

export const PublishNetlifyModal: React.FC<PublishNetlifyModalProps> = ({
  open,
  onOpenChange,
  project,
  onSuccess,
}) => {
  const [subdomain, setSubdomain] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate suggested subdomain from project name
  useEffect(() => {
    if (project && open) {
      const suggested = project.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);
      setSubdomain(suggested || 'my-website');
      setDeployedUrl(null);
      setError(null);
    }
  }, [project, open]);

  const validateSubdomain = (value: string): string | null => {
    if (!value) return 'Subdomain is required';
    if (value.length < 3) return 'Subdomain must be at least 3 characters';
    if (value.length > 63) return 'Subdomain must be 63 characters or less';
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(value)) {
      return 'Use only lowercase letters, numbers, and hyphens (cannot start/end with hyphen)';
    }
    return null;
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(value);
    setError(null);
  };

  const handleDeploy = async () => {
    if (!project) return;

    const validationError = validateSubdomain(subdomain);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsDeploying(true);
    setError(null);

    try {
      // Get file contents
      const htmlFile = project.files.find(f => f.file_name === 'index.html' || f.language === 'html');
      const cssFile = project.files.find(f => f.file_name === 'styles.css' || f.language === 'css');
      const jsFile = project.files.find(f => f.file_name === 'script.js' || f.language === 'javascript');

      if (!htmlFile) {
        throw new Error('No HTML file found in project');
      }

      // Prepare HTML with embedded CSS/JS references
      let htmlContent = htmlFile.file_content;
      
      // If CSS exists and isn't already linked, add inline style reference
      if (cssFile && !htmlContent.includes('styles.css')) {
        htmlContent = htmlContent.replace('</head>', `  <link rel="stylesheet" href="styles.css">\n</head>`);
      }
      
      // If JS exists and isn't already linked, add script reference
      if (jsFile && !htmlContent.includes('script.js')) {
        htmlContent = htmlContent.replace('</body>', `  <script src="script.js"></script>\n</body>`);
      }

      // Call the edge function
      const { data, error: deployError } = await supabase.functions.invoke('deploy-to-netlify', {
        body: {
          subdomain,
          htmlContent,
          cssContent: cssFile?.file_content || '',
          jsContent: jsFile?.file_content || '',
          projectId: project.id,
          projectName: project.name,
        },
      });

      if (deployError) {
        throw new Error(deployError.message || 'Deployment failed');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.success && data?.url) {
        setDeployedUrl(data.url);
        toast({
          title: '🚀 Deployed Successfully!',
          description: `Your website is now live at ${data.url}`,
        });
        onSuccess?.(data.url);
      } else {
        throw new Error('Unexpected response from deployment service');
      }

    } catch (err: any) {
      console.error('Deployment error:', err);
      setError(err.message || 'Failed to deploy. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Deployment Failed',
        description: err.message || 'Failed to deploy to Netlify',
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyUrl = async () => {
    if (deployedUrl) {
      await navigator.clipboard.writeText(deployedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Copied!', description: 'URL copied to clipboard' });
    }
  };

  const handleOpenUrl = () => {
    if (deployedUrl) {
      window.open(deployedUrl, '_blank');
    }
  };

  const subdomainError = subdomain ? validateSubdomain(subdomain) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1e1e1e] border-[#3c3c3c] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Globe className="h-5 w-5 text-blue-400" />
            Publish to Netlify
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Deploy your website to a free Netlify subdomain
          </DialogDescription>
        </DialogHeader>

        {!deployedUrl ? (
          <div className="space-y-4">
            {/* Project Info */}
            <div className="p-3 bg-[#252526] rounded-lg border border-[#3c3c3c]">
              <p className="text-sm text-gray-400">Project</p>
              <p className="font-medium text-white">{project?.name || 'Untitled'}</p>
              <div className="flex gap-1 mt-2">
                {project?.files.map((f) => (
                  <Badge 
                    key={f.id} 
                    variant="secondary" 
                    className="bg-[#3c3c3c] text-gray-300 text-xs"
                  >
                    {f.file_name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Subdomain Input */}
            <div className="space-y-2">
              <Label htmlFor="subdomain" className="text-gray-300">
                Choose your subdomain
              </Label>
              <div className="flex items-center gap-0">
                <Input
                  id="subdomain"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  placeholder="my-website"
                  className="rounded-r-none bg-[#252526] border-[#3c3c3c] text-white focus:border-blue-500"
                  disabled={isDeploying}
                />
                <div className="px-3 py-2 bg-[#3c3c3c] border border-l-0 border-[#3c3c3c] rounded-r-md text-gray-400 text-sm whitespace-nowrap">
                  .netlify.app
                </div>
              </div>
              
              {/* Live URL Preview */}
              {subdomain && !subdomainError && (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Your site will be at: https://{subdomain}.netlify.app
                </p>
              )}
              
              {subdomainError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {subdomainError}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </p>
              </div>
            )}

            {/* Deploy Button */}
            <Button
              onClick={handleDeploy}
              disabled={isDeploying || !subdomain || !!subdomainError}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deploying to Netlify...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy to Netlify
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Free hosting • Instant deployment • HTTPS included
            </p>
          </div>
        ) : (
          /* Success State */
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-lg font-semibold text-green-400 mb-1">
                🎉 Deployment Successful!
              </p>
              <p className="text-sm text-gray-400">
                Your website is now live
              </p>
            </div>

            {/* Live URL */}
            <div className="p-3 bg-[#252526] rounded-lg border border-[#3c3c3c]">
              <p className="text-xs text-gray-400 mb-1">Live URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm text-blue-400 break-all">
                  {deployedUrl}
                </code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleCopyUrl}
                variant="outline"
                className="flex-1 bg-[#252526] border-[#3c3c3c] text-white hover:bg-[#3c3c3c]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </>
                )}
              </Button>
              <Button
                onClick={handleOpenUrl}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Site
              </Button>
            </div>

            {/* Deploy Another */}
            <Button
              onClick={() => {
                setDeployedUrl(null);
                setError(null);
              }}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white hover:bg-[#3c3c3c]"
            >
              Deploy to a different subdomain
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
