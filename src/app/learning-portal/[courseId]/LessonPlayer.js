'use client';
import { useState, useEffect } from 'react';

export default function LessonPlayer({ lessons, completedIds: initialCompleted }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [completed, setCompleted] = useState(new Set(initialCompleted));
  const [saving, setSaving] = useState(false);

  // Pronunciation States
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [targetSentence, setTargetSentence] = useState('Let your tongue be your weapon');
  const [userTranscript, setUserTranscript] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [speechResultWords, setSpeechResultWords] = useState([]);
  const [recognition, setRecognition] = useState(null);

  const lesson = lessons[activeIdx];

  // Set default target sentence based on lesson title or dynamic content
  useEffect(() => {
    if (lesson?.title) {
      setTargetSentence(`I am practicing the lesson: ${lesson.title}`);
    } else {
      setTargetSentence('Let your tongue be your weapon');
    }
    setUserTranscript('');
    setPronunciationScore(null);
    setSpeechResultWords([]);
  }, [activeIdx, lesson]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        setUserTranscript('Listening...');
        setPronunciationScore(null);
        setSpeechResultWords([]);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserTranscript(transcript);
        evaluatePronunciation(transcript);
      };

      rec.onerror = (e) => {
        console.error(e);
        setIsRecording(false);
        setUserTranscript('Error occurred during recognition. Try again.');
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
      } catch (err) {
        recognition.stop();
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const evaluatePronunciation = (transcript) => {
    const cleanWord = (w) => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
    const targetWords = targetSentence.split(' ').map(cleanWord);
    const spokenWords = transcript.split(' ').map(cleanWord);

    let matches = 0;
    const resultWords = targetSentence.split(' ').map((word) => {
      const cleaned = cleanWord(word);
      const indexInSpoken = spokenWords.indexOf(cleaned);
      const isMatch = indexInSpoken !== -1;
      if (isMatch) {
        matches++;
        // Remove it so duplicates are checked correctly
        spokenWords.splice(indexInSpoken, 1);
      }
      return {
        original: word,
        matched: isMatch
      };
    });

    const score = Math.round((matches / targetWords.length) * 100);
    setPronunciationScore(score);
    setSpeechResultWords(resultWords);
  };

  const markComplete = async () => {
    if (completed.has(lesson.id)) return;
    setSaving(true);
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: lesson.id, completed: true }),
    });
    setCompleted((prev) => new Set([...prev, lesson.id]));
    setSaving(false);
  };

  return (
    <div className="lesson-player">
      <div className="lesson-content-area glass">
        <div className="lesson-content-header">
          <h2>{lesson.title}</h2>
          <span className={`lesson-status ${completed.has(lesson.id) ? 'done' : ''}`}>
            {completed.has(lesson.id) ? '✓ Completed' : 'In Progress'}
          </span>
        </div>

        {/* Video */}
        {lesson.videoUrl && (
          <div className="video-wrapper">
            {lesson.videoUrl.includes('zoom.us') || lesson.videoUrl.includes('zoom.com') ? (
              <div className="zoom-meeting-wrapper" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(45, 140, 255, 0.05)', border: '2px dashed #2D8CFF', borderRadius: '12px', margin: '1rem 0' }}>
                <h3 style={{ color: '#2D8CFF', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>🎥 Live Zoom Class</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>This lesson is scheduled as a live online classroom session.</p>
                <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ backgroundColor: '#2D8CFF', borderColor: '#2D8CFF', padding: '0.75rem 2rem', fontSize: '1.05rem', borderRadius: 'var(--radius-full)' }}>
                  Join Live Zoom Session
                </a>
              </div>
            ) : (
              <video controls src={lesson.videoUrl} className="lesson-video">
                Your browser does not support video.
              </video>
            )}
          </div>
        )}

        {/* Audio */}
        {lesson.audioUrl && (
          <div className="audio-wrapper">
            <p className="media-label">🎵 Audio Lesson</p>
            <audio controls src={lesson.audioUrl} className="lesson-audio" />
          </div>
        )}

        {/* PDF */}
        {lesson.pdfUrl && (
          <div className="pdf-wrapper">
            <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              📄 Download PDF Material
            </a>
          </div>
        )}

        {/* Text content */}
        {lesson.content && (
          <div
            className="lesson-text"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        )}

        {!lesson.videoUrl && !lesson.audioUrl && !lesson.content && (
          <div className="lesson-placeholder">
            <p>📭 Lesson content coming soon.</p>
          </div>
        )}

        {/* AI Spoken Practice Pronunciation Assessment Widget */}
        <div className="spoken-practice-section mt-5 glass padding-lg radius-lg">
          <h3 className="text-primary mb-4">🎤 Spoken Practice & Pronunciation Trainer</h3>
          <p className="mb-4 text-muted">Practice speaking the sentence below to assess your pronunciation accuracy.</p>
          
          <div className="target-phrase-box mb-4">
            <p className="media-label">Target Phrase:</p>
            <blockquote className="target-phrase">
              &ldquo;{targetSentence}&rdquo;
            </blockquote>
            <div className="target-input-edit mt-2">
              <label htmlFor="custom-phrase-input" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customize practice text:</label>
              <input
                id="custom-phrase-input"
                type="text"
                value={targetSentence}
                onChange={(e) => setTargetSentence(e.target.value)}
                placeholder="Type a sentence to practice..."
                style={{ marginTop: '0.2rem', padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          {speechSupported ? (
            <div className="speech-controls-layout">
              <div className="speech-btn-container mb-4">
                {isRecording ? (
                  <button onClick={stopListening} className="btn btn-primary recording-pulse" style={{ backgroundColor: '#ef4444' }}>
                    🛑 Stop Recording
                  </button>
                ) : (
                  <button onClick={startListening} className="btn btn-primary">
                    🎙️ Start Speaking
                  </button>
                )}
              </div>

              {userTranscript && (
                <div className="transcript-display mb-4">
                  <p className="media-label">You Said:</p>
                  <p className="spoken-transcript">&ldquo;{userTranscript}&rdquo;</p>
                </div>
              )}

              {pronunciationScore !== null && (
                <div className="evaluation-result">
                  <p className="media-label">Pronunciation Score:</p>
                  <div className="score-badge-container">
                    <span className={`score-badge ${pronunciationScore > 75 ? 'good' : pronunciationScore > 40 ? 'average' : 'poor'}`}>
                      {pronunciationScore}%
                    </span>
                    <span className="score-verdict">
                      {pronunciationScore > 85 ? '🌟 Excellent Pronunciation!' : pronunciationScore > 65 ? '👍 Very Good!' : '🔄 Try Speaking Slowly and Clearly.'}
                    </span>
                  </div>

                  <div className="word-by-word-feedback mt-4">
                    <p className="media-label">Word Feedback:</p>
                    <div className="feedback-words-flex">
                      {speechResultWords.map((wordObj, i) => (
                        <span key={i} className={`feedback-word ${wordObj.matched ? 'word-match' : 'word-miss'}`}>
                          {wordObj.original}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="speech-unsupported">
              <p>⚠️ Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge for pronunciation practice.</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation + completion */}
      <div className="lesson-nav">
        <button
          className="btn btn-outline"
          disabled={activeIdx === 0}
          onClick={() => setActiveIdx(activeIdx - 1)}
        >
          ← Previous
        </button>

        {!completed.has(lesson.id) && (
          <button className="btn btn-primary" onClick={markComplete} disabled={saving}>
            {saving ? 'Saving…' : '✓ Mark Complete'}
          </button>
        )}

        <button
          className="btn btn-outline"
          disabled={activeIdx === lessons.length - 1}
          onClick={() => setActiveIdx(activeIdx + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

