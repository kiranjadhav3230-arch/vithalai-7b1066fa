import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Globe, ExternalLink, Copy, Trash2, Eye, Calendar } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface PublishedWebsite {
  id: string;
  title: string;
  subdomain: string;
  custom_domain: string | null;
  view_count: number;
  created_at: string;
  is_published: boolean;
}

export const PublishedSitesManager = () => {
  const [websites, setWebsites] = useState<PublishedWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from('published_websites')
        .select('id, title, subdomain, custom_domain, view_count, created_at, is_published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebsites(data || []);
    } catch (error: any) {
      console.error('Error fetching websites:', error);
      toast.error("Failed to load published websites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const getUrl = (website: PublishedWebsite) => {
    return `https://${website.subdomain}.vithal-web.app`;
  };

  const copyUrl = (website: PublishedWebsite) => {
    const url = getUrl(website);
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('published_websites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Website deleted successfully");
      setWebsites(websites.filter(w => w.id !== id));
    } catch (error: any) {
      console.error('Error deleting website:', error);
      toast.error("Failed to delete website");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Published Websites</CardTitle>
          <CardDescription>Loading your published sites...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (websites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Published Websites</CardTitle>
          <CardDescription>You haven't published any websites yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Generate some code and click the "Publish Web" button to make it live!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            My Published Websites
          </CardTitle>
          <CardDescription>
            Manage your live websites ({websites.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {websites.map((website) => (
            <div
              key={website.id}
              className="border border-border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-foreground">{website.title}</h3>
                  <p className="text-sm text-primary font-mono">
                    {website.subdomain}.vithal-web.app
                  </p>
                  {website.custom_domain && (
                    <p className="text-sm text-muted-foreground">
                      Custom: {website.custom_domain}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(getUrl(website), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyUrl(website)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(website.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {website.view_count} views
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(website.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Published Website</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this website? This action cannot be undone and the website will no longer be accessible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
