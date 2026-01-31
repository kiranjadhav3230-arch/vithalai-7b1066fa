import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Link, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  Unlink,
  ExternalLink,
  Shield,
  Key
} from 'lucide-react';
import { useSupabaseConnection } from '@/hooks/useSupabaseConnection';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SupabaseConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

export const SupabaseConnectionModal: React.FC<SupabaseConnectionModalProps> = ({
  open,
  onOpenChange,
  onConnectionChange,
}) => {
  const {
    connection,
    isConnected,
    isLoading: hookLoading,
    error: connectionError,
    connect,
    disconnect,
    testConnection,
  } = useSupabaseConnection();

  const [projectUrl, setProjectUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [serviceKey, setServiceKey] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [showServiceKey, setShowServiceKey] = useState(false);
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    if (!projectUrl || !anonKey) {
      setTestResult({ success: false, message: 'Please enter both URL and Anon Key' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testConnection(projectUrl, anonKey);
      if (result.success) {
        setTestResult({ success: true, message: `Connected to ${result.projectName}` });
      } else {
        setTestResult({ success: false, message: result.error || 'Connection failed' });
      }
    } catch (err) {
      setTestResult({ success: false, message: 'Connection test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleConnect = async () => {
    if (!projectUrl || !anonKey || !serviceKey) {
      setTestResult({ success: false, message: 'Please fill in all fields' });
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const success = await connect(projectUrl, anonKey, serviceKey, accessToken || undefined);
      if (success) {
        setTestResult({ success: true, message: 'Successfully connected!' });
        onConnectionChange?.(true);
        // Clear form
        setProjectUrl('');
        setAnonKey('');
        setServiceKey('');
        setAccessToken('');
        setShowAdvanced(false);
      } else {
        setTestResult({ success: false, message: connectionError || 'Connection failed' });
      }
    } catch (err) {
      setTestResult({ success: false, message: 'Failed to save connection' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onConnectionChange?.(false);
    setTestResult(null);
  };

  if (hookLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            {isConnected ? 'Supabase Connected' : 'Connect Your Supabase Project'}
          </DialogTitle>
          <DialogDescription>
            {isConnected
              ? 'Your Supabase project is connected. Vithal AI can now create databases and APIs for your full-stack apps.'
              : 'Connect your own Supabase project to enable full-stack app generation with automatic database setup.'}
          </DialogDescription>
        </DialogHeader>

        {isConnected && connection ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">Connected</span>
                </div>
                <Badge variant="secondary" className="border-primary/30">
                  Active
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Project:</span>
                  <span className="font-mono">{connection.projectName || 'Supabase Project'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">URL:</span>
                  <span className="font-mono text-xs truncate max-w-[200px]">{connection.url}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Connected:</span>
                  <span>{new Date(connection.connectedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Auto Deploy:</span>
                  <span className={connection.accessToken ? 'text-green-500' : 'text-yellow-500'}>
                    {connection.accessToken ? '✓ Enabled' : '⚠️ Manual Required'}
                  </span>
                </div>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your credentials are stored locally and encrypted. They are only used when deploying databases to your project.
              </AlertDescription>
            </Alert>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(connection.url, '_blank')}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open Dashboard
              </Button>
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="gap-2"
              >
                <Unlink className="h-4 w-4" />
                Disconnect
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="projectUrl">Project URL</Label>
                <Input
                  id="projectUrl"
                  placeholder="https://your-project.supabase.co"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Find this in Supabase Dashboard → Settings → API
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="anonKey">Anon / Public Key</Label>
                <div className="relative">
                  <Input
                    id="anonKey"
                    type={showAnonKey ? 'text' : 'password'}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowAnonKey(!showAnonKey)}
                  >
                    {showAnonKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Safe to expose in frontend code
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceKey" className="flex items-center gap-2">
                  Service Role Key
                  <Badge variant="destructive" className="text-[10px]">SECRET</Badge>
                </Label>
                <div className="relative">
                  <Input
                    id="serviceKey"
                    type={showServiceKey ? 'text' : 'password'}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={serviceKey}
                    onChange={(e) => setServiceKey(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowServiceKey(!showServiceKey)}
                  >
                    {showServiceKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This key has full database access. Never share it publicly. It's stored locally and encrypted.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Advanced Section - Personal Access Token */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-between mt-2">
                    <span className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Advanced Options
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {showAdvanced ? '▲' : '▼'}
                    </span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="accessToken" className="flex items-center gap-2">
                      Personal Access Token
                      <Badge variant="secondary" className="text-[10px]">OPTIONAL</Badge>
                    </Label>
                    <div className="relative">
                      <Input
                        id="accessToken"
                        type={showAccessToken ? 'text' : 'password'}
                        placeholder="sbp_..."
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowAccessToken(!showAccessToken)}
                      >
                        {showAccessToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enables automatic database schema deployment and edge function deployment.
                      Without this, you'll need to manually run SQL in the Supabase dashboard.
                    </p>
                    <a 
                      href="https://supabase.com/dashboard/account/tokens" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      Get your Personal Access Token →
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {testResult && (
              <Alert variant={testResult.success ? 'default' : 'destructive'}>
                {testResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link className="h-3 w-3" />
              <a 
                href="https://supabase.com/dashboard/project/_/settings/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Where to find these keys →
              </a>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting || !projectUrl || !anonKey}
                className="gap-2"
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                Test Connection
              </Button>
              <Button
                onClick={handleConnect}
                disabled={isLoading || !projectUrl || !anonKey || !serviceKey}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Save & Connect
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
