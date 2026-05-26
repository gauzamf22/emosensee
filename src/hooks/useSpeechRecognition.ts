import { useState, useEffect, useRef } from 'react';

type Language = 'id-ID' | 'en-US';

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  start: (language: Language) => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;

    // Initialize SpeechRecognition
    const SpeechRecognition = (window as any).webkitSpeechRecognition || 
                              (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      setTranscript((prev) => {
        const base = prev + finalTranscript;
        return base + interimTranscript;
      });
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      switch (event.error) {
        case 'no-speech':
          setError('Tidak ada suara terdeteksi');
          break;
        case 'audio-capture':
          setError('Mikrofon tidak dapat diakses');
          break;
        case 'not-allowed':
          setError('Izin mikrofon ditolak');
          break;
        case 'network':
          setError('Koneksi internet bermasalah');
          break;
        default:
          setError('Terjadi kesalahan pada pengenalan suara');
      }
      
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isSupported]);

  const start = (language: Language) => {
    if (!isSupported || !recognitionRef.current) return;
    
    setError(null);
    setTranscript('');
    
    const recognition = recognitionRef.current;
    recognition.lang = language;
    
    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError('Gagal memulai pengenalan suara');
    }
  };

  const stop = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const reset = () => {
    setTranscript('');
    setError(null);
  };

  return {
    transcript,
    isListening,
    isSupported,
    error,
    start,
    stop,
    reset,
  };
}
