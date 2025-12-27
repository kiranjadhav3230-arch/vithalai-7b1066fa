import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './useLanguage';
import { useToast } from './use-toast';

export interface LegalCategory {
  id: string;
  category_type: string;
  name_en: string;
  name_hi: string;
  name_mr: string;
  description_en: string | null;
  description_hi: string | null;
  description_mr: string | null;
  icon: string;
  color: string;
  sort_order: number;
}

export interface LegalSituation {
  id: string;
  category_id: string;
  title_en: string;
  title_hi: string;
  title_mr: string;
  description_en: string | null;
  description_hi: string | null;
  description_mr: string | null;
  keywords: string[];
  severity_level: number;
  is_emergency: boolean;
}

export interface LegalRight {
  id: string;
  situation_id: string;
  right_text_en: string;
  right_text_hi: string;
  right_text_mr: string;
  legal_reference: string | null;
  section_number: string | null;
  act_name: string | null;
  priority_order: number;
}

export interface DoAndDont {
  id: string;
  situation_id: string;
  type: 'do' | 'dont';
  content_en: string;
  content_hi: string;
  content_mr: string;
  icon: string | null;
  priority_order: number;
}

export interface ActionStep {
  id: string;
  situation_id: string;
  step_order: number;
  action_text_en: string;
  action_text_hi: string;
  action_text_mr: string;
  action_type: string;
  action_data: Record<string, unknown>;
  is_critical: boolean;
}

export interface Helpline {
  id: string;
  name_en: string;
  name_hi: string;
  name_mr: string;
  phone_number: string;
  category: string | null;
  description_en: string | null;
  description_hi: string | null;
  is_toll_free: boolean;
  working_hours: string;
  state: string;
}

export interface SituationDetails {
  situation: LegalSituation;
  rights: LegalRight[];
  dosAndDonts: DoAndDont[];
  actionSteps: ActionStep[];
  helplines: Helpline[];
}

export const useHaqJaano = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [categories, setCategories] = useState<LegalCategory[]>([]);
  const [situations, setSituations] = useState<LegalSituation[]>([]);
  const [situationDetails, setSituationDetails] = useState<SituationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');

  const getLocalizedText = useCallback((item: { 
    [key: string]: unknown 
  }, field: string): string => {
    const langField = `${field}_${language}`;
    return (item[langField] as string) || (item[`${field}_en`] as string) || '';
  }, [language]);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('legal_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      setCategories((data || []) as LegalCategory[]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'श्रेणियां लोड नहीं हो सकीं' : 
          language === 'mr' ? 'श्रेण्या लोड होऊ शकल्या नाहीत' : 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [language, toast]);

  const fetchSituationsByCategory = useCallback(async (categoryId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('legal_situations')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('severity_level', { ascending: false });
      
      if (error) throw error;
      setSituations((data || []) as LegalSituation[]);
    } catch (error) {
      console.error('Error fetching situations:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'स्थितियां लोड नहीं हो सकीं' : 
          language === 'mr' ? 'परिस्थिती लोड होऊ शकल्या नाहीत' : 'Failed to load situations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [language, toast]);

  const fetchSituationDetails = useCallback(async (situationId: string) => {
    setIsLoading(true);
    try {
      // Fetch all related data in parallel
      const [situationRes, rightsRes, dosRes, stepsRes, helplinesRes] = await Promise.all([
        supabase.from('legal_situations').select('*').eq('id', situationId).single(),
        supabase.from('legal_rights').select('*').eq('situation_id', situationId).eq('is_active', true).order('priority_order'),
        supabase.from('dos_and_donts').select('*').eq('situation_id', situationId).order('priority_order'),
        supabase.from('action_steps').select('*').eq('situation_id', situationId).order('step_order'),
        supabase.from('helpline_directory').select('*').eq('is_active', true).order('is_toll_free', { ascending: false }),
      ]);

      if (situationRes.error) throw situationRes.error;

      setSituationDetails({
        situation: situationRes.data as LegalSituation,
        rights: (rightsRes.data || []) as LegalRight[],
        dosAndDonts: (dosRes.data || []) as DoAndDont[],
        actionSteps: (stepsRes.data || []) as ActionStep[],
        helplines: (helplinesRes.data || []) as Helpline[],
      });
    } catch (error) {
      console.error('Error fetching situation details:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'विवरण लोड नहीं हो सके' : 
          language === 'mr' ? 'तपशील लोड होऊ शकले नाहीत' : 'Failed to load details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [language, toast]);

  const fetchHelplines = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('helpline_directory')
        .select('*')
        .eq('is_active', true)
        .order('is_toll_free', { ascending: false });
      if (error) throw error;
      return (data || []) as Helpline[];
    } catch (error) {
      console.error('Error fetching helplines:', error);
      return [];
    }
  }, []);

  const askAI = useCallback(async (query: string) => {
    setIsAiLoading(true);
    setAiResponse('');
    
    try {
      const response = await supabase.functions.invoke('haq-jaano-ai', {
        body: { query, language },
      });

      if (response.error) throw response.error;
      
      setAiResponse(response.data.response || '');
      return response.data;
    } catch (error) {
      console.error('Error asking AI:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'AI से उत्तर नहीं मिल सका' : 
          language === 'mr' ? 'AI कडून उत्तर मिळू शकले नाही' : 'Could not get AI response',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsAiLoading(false);
    }
  }, [language, toast]);

  const searchSituations = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('legal_situations')
        .select('*')
        .eq('is_active', true)
        .or(`title_en.ilike.%${searchQuery}%,title_hi.ilike.%${searchQuery}%,title_mr.ilike.%${searchQuery}%`);
      
      if (error) throw error;
      setSituations((data || []) as LegalSituation[]);
    } catch (error) {
      console.error('Error searching situations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveToHistory = useCallback(async (situationId: string, queryText: string, response: string, isEmergency: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('user_rights_history').insert({
        user_id: user.id,
        situation_id: situationId,
        query_text: queryText,
        ai_response: response,
        is_emergency: isEmergency,
        language,
      });
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }, [language]);

  return {
    categories,
    situations,
    situationDetails,
    isLoading,
    isAiLoading,
    aiResponse,
    fetchCategories,
    fetchSituationsByCategory,
    fetchSituationDetails,
    fetchHelplines,
    askAI,
    searchSituations,
    saveToHistory,
    getLocalizedText,
    setSituationDetails,
    setSituations,
  };
};
