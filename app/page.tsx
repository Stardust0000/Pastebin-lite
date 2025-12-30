
"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreatePaste() {
    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error("Failed to create paste");
      }

      const data = await res.json();
      console.log(data);
      setResultUrl(data.url);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
    }


  return (
    <div className="container">
      <h1>Pastebin Lite</h1>

      <textarea
        placeholder="Type or paste your text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleCreatePaste} disabled={loading || !content.trim()}>
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {resultUrl && (
        <div className="result">
          <p className="para">Your paste is ready:</p>
          <button onClick={() => { window.location.href = resultUrl;}}>
            Open Paste
        </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <style jsx>{`
        .container {
          max-width: 720px;
          margin: 80px auto;
          padding: 24px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        h1 {
          font-size: 32px;
          margin-bottom: 16px;
          text-align: center;
        }

        textarea {
          width: 100%;
          height: 240px;
          padding: 16px;
          font-size: 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          resize: vertical;
          margin-bottom: 16px;
          font-family: monospace;
        }

        button {
          padding: 12px 20px;
          font-size: 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          background-color: #111827;
          color: white;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .para{
          color: #00000cff;
          padding-bottom: 0.6rem
        }
        .result {
          margin-top: 24px;
          padding: 16px;
          background: #f4f4f5;
          border-radius: 8px;
        }

        .result a {
          word-break: break-all;
          color: #2563eb;
          text-decoration: underline;
        }

        .error {
          margin-top: 16px;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
}
