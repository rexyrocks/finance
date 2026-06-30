'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Send, Loader2 } from 'lucide-react';

const SUGGESTIONS = [
  "What's my total insurance cover?",
  'How much debt do I have?',
  'How can I increase my net worth?',
];

export function AskAiPanel() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(q: string) {
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setAnswer(data.answer);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-gold-300" />
        <h3 className="text-sm font-medium text-ink-0">Ask about your finances</h3>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuestion(s);
              ask(s);
            }}
            className="rounded-full border border-ink-700 px-3 py-1 text-xs text-ink-200 hover:border-gold-400 hover:text-gold-300"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) ask(question);
        }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Am I over-leveraged on real estate?"
          className="h-10 flex-1 rounded-xl border border-ink-700 bg-ink-800 px-3 text-sm text-ink-0 placeholder:text-ink-200 focus:border-gold-400 focus:outline-none"
        />
        <Button type="submit" variant="primary" size="md" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </Button>
      </form>

      {error && <p className="mt-3 text-xs text-coral-300">{error}</p>}
      {answer && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-100">{answer}</p>}
    </Card>
  );
}
