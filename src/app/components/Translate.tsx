"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, ChevronDown } from "lucide-react";
import { default as languageCodes } from "../data/language-code";

interface Language {
  code: string;
  name: string;
}

const Translate = () => {
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("en-English");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const formattedLanguages = Object.entries(languageCodes).map(
      ([code, name]) => ({
        code,
        name: name as string,
      })
    );
    setLanguages(formattedLanguages);

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleOnRecord = useCallback(async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsPlay(true);
    };

    recognition.onend = () => {
      setIsPlay(false);
    };

    recognition.onresult = async (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setTranscriptText(transcript);

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript, language: selectedLanguage }),
      });
      const data = await response.json();
      setTranslation(data.text);

      const preferredVoice =
        voices.find((v) => v.lang.startsWith(selectedLanguage)) ||
        voices.find((v) => v.lang.startsWith(selectedLanguage.split("-")[0])) ||
        voices[0];

      const utterance = new SpeechSynthesisUtterance(data.text);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      window.speechSynthesis.speak(utterance);
    };

    recognition.start();
  }, [selectedLanguage, voices]);

  const handleStop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsPlay(false);
    }
  }, []);

  return (
    <section className="w-full lg:w-1/3 mb-6 md:mb-0 mx-auto">
      <div>
        <div className="mb-2">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Languages
          </label>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="" disabled>
                Select a language
              </option>
              {languages.map((language) => (
                <option
                  key={language.code}
                  value={`${language.code}-${language.name}`}
                >
                  {language.name} ({language.code})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown />
            </div>
          </div>
        </div>

        <button
          className={`${
            isPlay
              ? "bg-red-500 hover:bg-red-700"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 mt-1 rounded flex items-center justify-center w-full`}
          onClick={isPlay ? handleStop : handleOnRecord}
        >
          {isPlay ? <MicOff /> : <Mic />}
          {isPlay ? "Stop" : "Speak"}
        </button>
      </div>

      <div className="shadow rounded px-2 py-4 mt-10">
        <p>
          <span className="font-semibold">Text output:</span>{" "}
          <span className="text-gray-600">{transcriptText}</span>
        </p>
      </div>
      <div className="shadow rounded px-2 py-4 mt-2">
        <p>
          <span className="font-semibold">Translation:</span>{" "}
          <span className="text-gray-600">{translation}</span>
        </p>
      </div>
    </section>
  );
};

export default Translate;
