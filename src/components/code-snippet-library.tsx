import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, X, Copy, Trash2, Star, StarOff, Code2, Calendar, Tag } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { User } from '@supabase/supabase-js';

interface CodeSnippet {
  id: string;
  title: string;
  description: string | null;
  generated_code: string;
  language: string;
  tags: string[] | null;
  is_favorite: boolean | null;
  created_at: string;
}

interface CodeSnippetLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export const CodeSnippetLibrary: React.FC<CodeSnippetLibraryProps> = ({ open, onOpenChange, user }) => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadSnippets();
    }
  }, [open]);

  useEffect(() => {
    filterSnippets();
  }, [searchQuery, selectedTags, snippets]);

  const loadSnippets = async () => {
    const { data, error } = await supabase
      .from('code_snippets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load snippets", variant: "destructive" });
      return;
    }

    setSnippets(data || []);
    
    // Extract all unique tags
    const tags = new Set<string>();
    data?.forEach(snippet => {
      snippet.tags?.forEach(tag => tags.add(tag));
    });
    setAllTags(Array.from(tags));
  };

  const filterSnippets = () => {
    let filtered = snippets;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.description?.toLowerCase().includes(query) ||
        snippet.language.toLowerCase().includes(query) ||
        snippet.generated_code.toLowerCase().includes(query)
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(snippet =>
        selectedTags.every(tag => snippet.tags?.includes(tag))
      );
    }

    setFilteredSnippets(filtered);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleFavorite = async (snippet: CodeSnippet) => {
    const { error } = await supabase
      .from('code_snippets')
      .update({ is_favorite: !snippet.is_favorite })
      .eq('id', snippet.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update favorite", variant: "destructive" });
      return;
    }

    setSnippets(prev =>
      prev.map(s => s.id === snippet.id ? { ...s, is_favorite: !s.is_favorite } : s)
    );
    toast({ title: "Success", description: snippet.is_favorite ? "Removed from favorites" : "Added to favorites" });
  };

  const deleteSnippet = async (id: string) => {
    const { error } = await supabase
      .from('code_snippets')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete snippet", variant: "destructive" });
      return;
    }

    setSnippets(prev => prev.filter(s => s.id !== id));
    setSelectedSnippet(null);
    toast({ title: "Success", description: "Snippet deleted" });
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Code copied to clipboard" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Code Snippet Library
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 p-6 pt-4 h-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Snippets List */}
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {filteredSnippets.map(snippet => (
                  <Card
                    key={snippet.id}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedSnippet?.id === snippet.id ? 'border-primary bg-accent' : ''
                    }`}
                    onClick={() => setSelectedSnippet(snippet)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm line-clamp-1">{snippet.title}</h3>
                        {snippet.is_favorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      {snippet.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {snippet.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {snippet.language}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(snippet.created_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredSnippets.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Code2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No snippets found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {selectedSnippet ? (
              <>
                <div className="flex items-start justify-between mb-4 pb-4 border-b">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{selectedSnippet.title}</h2>
                    {selectedSnippet.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {selectedSnippet.description}
                      </p>
                    )}
                    {selectedSnippet.tags && selectedSnippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedSnippet.tags.map(tag => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(selectedSnippet)}
                    >
                      {selectedSnippet.is_favorite ? (
                        <StarOff className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode(selectedSnippet.generated_code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSnippet(selectedSnippet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="rounded-lg overflow-hidden border">
                    <SyntaxHighlighter
                      language={selectedSnippet.language}
                      style={vscDarkPlus}
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        fontSize: '0.875rem',
                      }}
                    >
                      {selectedSnippet.generated_code}
                    </SyntaxHighlighter>
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Code2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Select a snippet to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
