import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ExamHistoryEntry {
  id: string;
  user_id: string;
  topic: string;
  user_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  certificate_id: string | null;
  completed_at: string;
  created_at: string;
}

export const useExamHistory = (userId: string | null) => {
  const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [cooldowns, setCooldowns] = useState<Record<string, Date | null>>({});

  const fetchExamHistory = useCallback(async () => {
    if (!userId) {
      setExamHistory([]);
      setCooldowns({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_exam_history')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const history = (data || []) as ExamHistoryEntry[];
      setExamHistory(history);

      // Calculate cooldowns for each topic
      const topicCooldowns: Record<string, Date | null> = {};
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

      history.forEach((entry) => {
        if (!topicCooldowns[entry.topic]) {
          const completedDate = new Date(entry.completed_at);
          const cooldownEndDate = new Date(completedDate.getTime() + sevenDaysMs);
          
          if (cooldownEndDate > new Date()) {
            topicCooldowns[entry.topic] = cooldownEndDate;
          } else {
            topicCooldowns[entry.topic] = null;
          }
        }
      });

      setCooldowns(topicCooldowns);
    } catch (error) {
      console.error('Error fetching exam history:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchExamHistory();
  }, [fetchExamHistory]);

  const saveExamResult = async (
    topic: string,
    userName: string,
    score: number,
    totalQuestions: number,
    passed: boolean,
    certificateId?: string
  ) => {
    if (!userId) return null;

    const percentage = Math.round((score / totalQuestions) * 100);

    try {
      const { data, error } = await supabase
        .from('user_exam_history')
        .insert({
          user_id: userId,
          topic,
          user_name: userName,
          score,
          total_questions: totalQuestions,
          percentage,
          passed,
          certificate_id: certificateId || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh history after saving
      await fetchExamHistory();
      
      return data as ExamHistoryEntry;
    } catch (error) {
      console.error('Error saving exam result:', error);
      return null;
    }
  };

  const canTakeExam = (topic: string): boolean => {
    const cooldownEnd = cooldowns[topic];
    if (!cooldownEnd) return true;
    return new Date() >= cooldownEnd;
  };

  const getCooldownRemaining = (topic: string): string | null => {
    const cooldownEnd = cooldowns[topic];
    if (!cooldownEnd) return null;

    const now = new Date();
    if (now >= cooldownEnd) return null;

    const diffMs = cooldownEnd.getTime() - now.getTime();
    const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h`;
  };

  const getTopicHistory = (topic: string): ExamHistoryEntry[] => {
    return examHistory.filter((entry) => entry.topic === topic);
  };

  const getPassedTopics = (): string[] => {
    const passed = new Set<string>();
    examHistory.forEach((entry) => {
      if (entry.passed) passed.add(entry.topic);
    });
    return Array.from(passed);
  };

  return {
    examHistory,
    loading,
    cooldowns,
    saveExamResult,
    canTakeExam,
    getCooldownRemaining,
    getTopicHistory,
    getPassedTopics,
    refetch: fetchExamHistory,
  };
};
