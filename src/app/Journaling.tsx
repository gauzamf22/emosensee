import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNotifications } from "./notifications";
import { createJournal, getJournals, Journal } from "../services/journals";
import { useTranslation } from "../translations";

const MAX = 500;

function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getAvatarColor(title: string): { text: string; bg: string } {
  const colors = [
    { text: '#3B5BDB', bg: '#EEF2FF' },
    { text: '#7C3AED', bg: '#F5F3FF' },
    { text: '#059669', bg: '#ECFDF5' },
    { text: '#EA580C', bg: '#FFF7ED' },
    { text: '#DB2777', bg: '#FDF2F8' },
    { text: '#0891B2', bg: '#F0FDFA' },
  ];
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export default function Journaling() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const { push } = useNotifications();
  const { t } = useTranslation();

  const loadJournals = async (loadOffset: number = 0, append: boolean = false) => {
    try {
      setIsLoading(true);
      const response = await getJournals(10, loadOffset);
      
      if (append) {
        setJournals(prev => [...prev, ...response.data]);
      } else {
        setJournals(response.data);
      }
      
      setHasMore(response.pagination?.hasMore || false);
      setOffset(loadOffset);
    } catch (error) {
      console.error('Failed to load journals:', error);
      push({
        source: "journey",
        title: t.journaling.loadError,
        body: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !desc.trim()) {
      push({
        source: "journey",
        title: t.journaling.validationError,
        body: t.journaling.validationMessage,
      });
      return;
    }

    try {
      setIsSaving(true);
      await createJournal(title, desc);
      
      push({
        source: "journey",
        title: t.journaling.saved,
        body: t.journaling.savedMessage,
      });
      
      // Clear form
      setTitle("");
      setDesc("");
      
      // Reload journals from start
      await loadJournals(0, false);
    } catch (error) {
      console.error('Failed to save journal:', error);
      push({
        source: "journey",
        title: t.journaling.error,
        body: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadMore = () => {
    loadJournals(offset + 10, true);
  };

  useEffect(() => {
    loadJournals(0, false);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <p className="font-['Inter'] font-medium text-sm text-[#9b9b9b] -mt-2">
        {t.journaling.subtitle}
      </p>

      <section className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-5 sm:p-6 flex flex-col gap-4">
        <div className="border-b border-[#EFEFF3] pb-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.journaling.titlePlaceholder}
            className="w-full bg-transparent outline-none font-['Poppins'] text-[15px] text-[#1f1f1f] placeholder:text-[#c1c1c1]"
          />
        </div>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value.slice(0, MAX))}
          placeholder={t.journaling.descPlaceholder}
          rows={6}
          className="w-full bg-transparent outline-none resize-none font-['Nunito'] text-sm text-[#1f1f1f] placeholder:text-[#c1c1c1] min-h-[140px]"
        />
        <div className="flex justify-between items-center">
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !desc.trim()}
            className="px-4 py-2 bg-[#0063F3] text-white font-['Nunito'] font-medium text-sm rounded-lg hover:bg-[#0052CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? t.journaling.saving : t.journaling.save}
          </button>
          <span className="font-['Nunito'] text-xs text-[#9b9b9b]">
            {desc.length}/{MAX}
          </span>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base">{t.journaling.yourJournal}</h3>
        <button className="flex items-center gap-1 text-[#9b9b9b] font-['Nunito'] font-medium text-sm">
          {t.journaling.week}
          <ChevronDown className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {isLoading && journals.length === 0 ? (
          <div className="text-center py-8 font-['Nunito'] text-sm text-[#9b9b9b]">
            {t.journaling.loadingJournals}
          </div>
        ) : journals.length === 0 ? (
          <div className="text-center py-8 font-['Nunito'] text-sm text-[#9b9b9b]">
            {t.journaling.noJournals}
          </div>
        ) : (
          <>
            {journals.map((journal) => {
              const avatarColor = getAvatarColor(journal.title);
              const firstLetter = (journal.title.charAt(0) || 'J').toUpperCase();
              
              return (
                <article
                  key={journal.id}
                  className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-4 sm:p-5 flex gap-4"
                >
                  <div 
                    className="size-10 rounded-full shrink-0 mt-1 flex items-center justify-center"
                    style={{ backgroundColor: avatarColor.bg }}
                  >
                    <span 
                      className="font-['Poppins'] font-semibold text-base"
                      style={{ color: avatarColor.text }}
                    >
                      {firstLetter}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-['Nunito'] text-xs text-[#9b9b9b]">
                      <span>{formatTime(journal.created_at)}</span>
                      <span className="size-1 rounded-full bg-[#c1c1c1]" />
                      <span>{formatDate(journal.created_at)}</span>
                    </div>
                    <h4 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-[15px] mt-1">
                      {journal.title}
                    </h4>
                    <p className="font-['Nunito'] text-sm text-[#9b9b9b] leading-6 mt-1 line-clamp-2">
                      {journal.description}
                    </p>
                  </div>
                </article>
              );
            })}
            
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full py-3 bg-white rounded-xl border border-[#EFEFF3] shadow-[0_4px_12px_-6px_rgba(17,24,39,0.06)] font-['Nunito'] font-medium text-sm text-[#0063F3] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t.journaling.loading : t.journaling.loadMore}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
