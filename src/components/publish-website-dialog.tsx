import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Globe, Loader2, ExternalLink, Copy } from "lucide-react";

interface PublishWebsiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  language: string;
  codeSnippetId?: string;
}

export const PublishWebsiteDialog = ({
  open,
  onOpenChange,
  code,
  language,
  codeSnippetId,
}: PublishWebsiteDialogProps) => {
  const [title, setTitle] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const generateSubdomain = () => {
    const random = Math.random().toString(36).substring(2, 8);
    setSubdomain(`site-${random}`);
  };

  const handlePublish = async () => {
    if (!title.trim() || !subdomain.trim()) {
      toast.error("Please enter both title and subdomain");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      toast.error("Subdomain can only contain lowercase letters, numbers, and hyphens");
      return;
    }

    setPublishing(true);

    try {
      const { data, error } = await supabase.functions.invoke('publish-website', {
        body: {
          title,
          subdomain,
          customDomain: customDomain || null,
          htmlContent: code,
          cssContent: null,
          jsContent: null,
          language,
          codeSnippetId,
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Website published successfully!");
      setPublishedUrl(data.url);
    } catch (error: any) {
      console.error('Error publishing website:', error);
      toast.error(error.message || "Failed to publish website");
    } finally {
      setPublishing(false);
    }
  };

  const copyUrl = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      toast.success("URL copied to clipboard!");
    }
  };

  const handleClose = () => {
    setTitle("");
    setSubdomain("");
    setCustomDomain("");
    setPublishedUrl(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Publish Your Website
          </DialogTitle>
          <DialogDescription>
            Publish your code as a live website accessible to anyone
          </DialogDescription>
        </DialogHeader>

        {!publishedUrl ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Website Title *</Label>
              <Input
                id="title"
                placeholder="My Awesome Website"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain *</Label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    id="subdomain"
                    placeholder="my-site"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    .vithal-web.app
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSubdomain}
                  size="sm"
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, and hyphens allowed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
              <Input
                id="customDomain"
                placeholder="mywebsite.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You'll need to configure DNS settings after publishing
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="rounded-lg border border-border bg-muted p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Globe className="h-4 w-4 text-primary" />
                Your website is live!
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={publishedUrl}
                  readOnly
                  className="flex-1 bg-background"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyUrl}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => window.open(publishedUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {!publishedUrl ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handlePublish} disabled={publishing}>
                {publishing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Publish
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
