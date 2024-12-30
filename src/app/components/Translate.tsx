"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, ChevronDown } from "lucide-react";

const Translate = () => {
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const getPreferredVoice = () => {
    const googleVoice = voices.find((voice) =>
      voice.name.toLowerCase().includes("google")
    );
    const lucianaVoice = voices.find((voice) =>
      voice.name.toLowerCase().includes("luciana")
    );

    return googleVoice || lucianaVoice || voices[0];
  };

  const handleOnRecord = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    console.log(SpeechRecognition);

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsPlay(true);
    };

    recognition.onend = () => {
      console.log("Speech recognition stopped");
      setIsPlay(false);
    };

    recognition.onspeechend = () => {
      console.log("Speech ended");
    };

    recognition.onresult = async (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setTranscriptText(transcript);

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript, language: "tagalog" }),
      });
      const data = await response.json();
      setTranslation(data.text);

      const utterance = new SpeechSynthesisUtterance(data.text);
      utterance.voice = getPreferredVoice();
      window.speechSynthesis.speak(utterance);
    };

    recognition.start();
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsPlay(false);
      console.log("Speech recognition manually stopped");
    }
  };

  return (
    <section className="w-full lg:w-1/3  mb-6 md:mb-0 mx-auto">
      <div>
        <div className="mb-2">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Languges
          </label>
          <div className="relative">
            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
              <option>English</option>
              <option>Tagalog</option>
              <option>Japanese</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown />
            </div>
          </div>
        </div>

        {!isPlay ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-1 rounded flex items-center justify-center w-full"
            onClick={handleOnRecord}
          >
            <Mic />
            Speak
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-1 rounded flex items-center justify-center w-full"
            onClick={handleStop}
          >
            <MicOff />
            Stop
          </button>
        )}
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
