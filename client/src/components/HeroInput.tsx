import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface Props {
  onSubmit: (url: string) => void;
  disabled?: boolean;
}

export function HeroInput({ onSubmit, disabled }: Props) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let trimmed = url.trim();
    if (!trimmed) return;
    if (!trimmed.match(/^https?:\/\//i)) trimmed = "https://" + trimmed;
    onSubmit(trimmed);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1
        className="text-4xl font-bold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        RescueMyWorkday
      </h1>
      <p className="text-gray-500 mb-8">Website Audit Tool</p>

      <form onSubmit={handleSubmit} className="w-full max-w-xl flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={disabled}
          required
        />
        <Button type="submit" disabled={disabled || !url.trim()} size="lg">
          <Search className="w-4 h-4 mr-2" />
          Run Audit
        </Button>
      </form>
    </div>
  );
}
