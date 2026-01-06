import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  user_name: string;
  avatar_url: string | null;
  topic: string;
  score: number;
  total_questions: number;
  percentage: number;
  state: string;
  week_number: number;
  year: number;
  completed_at: string;
}

export interface UserRank {
  rank: number;
  entry: LeaderboardEntry | null;
}

export const INDIAN_STATES = [
  { en: 'All India', hi: 'पूरा भारत', mr: 'संपूर्ण भारत', value: 'all' },
  { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश', mr: 'आंध्र प्रदेश', value: 'Andhra Pradesh' },
  { en: 'Arunachal Pradesh', hi: 'अरुणाचल प्रदेश', mr: 'अरुणाचल प्रदेश', value: 'Arunachal Pradesh' },
  { en: 'Assam', hi: 'असम', mr: 'आसाम', value: 'Assam' },
  { en: 'Bihar', hi: 'बिहार', mr: 'बिहार', value: 'Bihar' },
  { en: 'Chhattisgarh', hi: 'छत्तीसगढ़', mr: 'छत्तीसगड', value: 'Chhattisgarh' },
  { en: 'Delhi', hi: 'दिल्ली', mr: 'दिल्ली', value: 'Delhi' },
  { en: 'Goa', hi: 'गोवा', mr: 'गोवा', value: 'Goa' },
  { en: 'Gujarat', hi: 'गुजरात', mr: 'गुजरात', value: 'Gujarat' },
  { en: 'Haryana', hi: 'हरियाणा', mr: 'हरियाणा', value: 'Haryana' },
  { en: 'Himachal Pradesh', hi: 'हिमाचल प्रदेश', mr: 'हिमाचल प्रदेश', value: 'Himachal Pradesh' },
  { en: 'Jharkhand', hi: 'झारखंड', mr: 'झारखंड', value: 'Jharkhand' },
  { en: 'Karnataka', hi: 'कर्नाटक', mr: 'कर्नाटक', value: 'Karnataka' },
  { en: 'Kerala', hi: 'केरल', mr: 'केरळ', value: 'Kerala' },
  { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश', mr: 'मध्य प्रदेश', value: 'Madhya Pradesh' },
  { en: 'Maharashtra', hi: 'महाराष्ट्र', mr: 'महाराष्ट्र', value: 'Maharashtra' },
  { en: 'Manipur', hi: 'मणिपुर', mr: 'मणिपूर', value: 'Manipur' },
  { en: 'Meghalaya', hi: 'मेघालय', mr: 'मेघालय', value: 'Meghalaya' },
  { en: 'Mizoram', hi: 'मिजोरम', mr: 'मिझोरम', value: 'Mizoram' },
  { en: 'Nagaland', hi: 'नागालैंड', mr: 'नागालँड', value: 'Nagaland' },
  { en: 'Odisha', hi: 'ओडिशा', mr: 'ओडिशा', value: 'Odisha' },
  { en: 'Punjab', hi: 'पंजाब', mr: 'पंजाब', value: 'Punjab' },
  { en: 'Rajasthan', hi: 'राजस्थान', mr: 'राजस्थान', value: 'Rajasthan' },
  { en: 'Sikkim', hi: 'सिक्किम', mr: 'सिक्कीम', value: 'Sikkim' },
  { en: 'Tamil Nadu', hi: 'तमिलनाडु', mr: 'तामिळनाडू', value: 'Tamil Nadu' },
  { en: 'Telangana', hi: 'तेलंगाना', mr: 'तेलंगणा', value: 'Telangana' },
  { en: 'Tripura', hi: 'त्रिपुरा', mr: 'त्रिपुरा', value: 'Tripura' },
  { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', mr: 'उत्तर प्रदेश', value: 'Uttar Pradesh' },
  { en: 'Uttarakhand', hi: 'उत्तराखंड', mr: 'उत्तराखंड', value: 'Uttarakhand' },
  { en: 'West Bengal', hi: 'पश्चिम बंगाल', mr: 'पश्चिम बंगाल', value: 'West Bengal' },
];

export const getWeekNumber = (date: Date = new Date()): number => {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.ceil(diff / oneWeek);
};

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRank, setUserRank] = useState<UserRank | null>(null);

  const fetchLeaderboard = useCallback(async (
    filter: 'week' | 'all' = 'week',
    topic: string = 'all',
    state: string = 'all'
  ) => {
    setLoading(true);
    try {
      let query = supabase
        .from('quiz_leaderboard_entries')
        .select('*')
        .order('percentage', { ascending: false })
        .order('completed_at', { ascending: true })
        .limit(50);

      if (filter === 'week') {
        const currentWeek = getWeekNumber();
        const currentYear = new Date().getFullYear();
        query = query
          .eq('week_number', currentWeek)
          .eq('year', currentYear);
      }

      if (topic !== 'all') {
        query = query.eq('topic', topic);
      }

      if (state !== 'all') {
        query = query.eq('state', state);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEntries(data as LeaderboardEntry[] || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserRank = useCallback(async (userId: string, filter: 'week' | 'all' = 'week') => {
    try {
      let query = supabase
        .from('quiz_leaderboard_entries')
        .select('*')
        .order('percentage', { ascending: false })
        .order('completed_at', { ascending: true });

      if (filter === 'week') {
        const currentWeek = getWeekNumber();
        const currentYear = new Date().getFullYear();
        query = query
          .eq('week_number', currentWeek)
          .eq('year', currentYear);
      }

      const { data, error } = await query;
      if (error) throw error;

      const entries = data as LeaderboardEntry[] || [];
      const userIndex = entries.findIndex(e => e.user_id === userId);
      
      if (userIndex >= 0) {
        setUserRank({
          rank: userIndex + 1,
          entry: entries[userIndex]
        });
      } else {
        setUserRank(null);
      }
    } catch (error) {
      console.error('Error fetching user rank:', error);
      setUserRank(null);
    }
  }, []);

  const submitToLeaderboard = useCallback(async (
    userId: string,
    userName: string,
    topic: string,
    score: number,
    totalQuestions: number,
    state: string,
    avatarUrl?: string,
    isWeeklyChallenge?: boolean
  ): Promise<{ success: boolean; rank?: number; bonusApplied?: boolean }> => {
    try {
      const currentWeek = getWeekNumber();
      const currentYear = new Date().getFullYear();

      // Check if this topic matches the current weekly challenge topic
      // Weekly topics rotate based on week number (8 topics total)
      const weeklyTopicIndex = currentWeek % 8;
      const weeklyTopics = [
        'fundamental_rights', 'consumer_rights', 'women_rights', 'police_rights',
        'rti_rights', 'cyber_rights', 'tenant_rights', 'senior_citizen_rights'
      ];
      const currentWeeklyTopic = weeklyTopics[weeklyTopicIndex];
      
      // Apply 2x bonus if this is a weekly challenge submission for the correct topic
      const bonusApplied = isWeeklyChallenge && topic === currentWeeklyTopic;
      const bonusMultiplier = bonusApplied ? 2 : 1;
      const baseScore = score;
      const finalScore = score * bonusMultiplier;
      const percentage = Math.round((score / totalQuestions) * 100);
      // Effective percentage for ranking (with bonus applied)
      const effectivePercentage = Math.min(percentage * bonusMultiplier, 200);

      const { data, error } = await supabase
        .from('quiz_leaderboard_entries')
        .insert({
          user_id: userId,
          user_name: userName,
          avatar_url: avatarUrl || null,
          topic,
          score: finalScore,
          base_score: baseScore,
          total_questions: totalQuestions,
          percentage: effectivePercentage,
          state,
          week_number: currentWeek,
          year: currentYear,
          is_weekly_challenge: bonusApplied,
          bonus_multiplier: bonusMultiplier,
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch rank after submission
      const { data: allEntries } = await supabase
        .from('quiz_leaderboard_entries')
        .select('*')
        .eq('week_number', currentWeek)
        .eq('year', currentYear)
        .order('percentage', { ascending: false })
        .order('completed_at', { ascending: true });

      const rank = (allEntries || []).findIndex(e => e.id === data.id) + 1;

      return { success: true, rank, bonusApplied };
    } catch (error) {
      console.error('Error submitting to leaderboard:', error);
      return { success: false };
    }
  }, []);

  return {
    entries,
    loading,
    userRank,
    fetchLeaderboard,
    fetchUserRank,
    submitToLeaderboard,
    getWeekNumber,
  };
};
