"use client";
import React, { useState } from "react";
import { Mic, MicOff, ChevronDown } from "lucide-react";

const Translate = () => {
  const [isPlay, setIsPlay] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");

  const handleOnRecord = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.onresult = async (e) => {
      console.log("event", e.results[0][0].transcript);
      const transcript = e.results[0][0].transcript;
      setTranscriptText(transcript);
    };
    recognition.start();
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
            onClick={() => setIsPlay(!isPlay)}
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
          <span className="text-gray-600">...</span>
        </p>
      </div>
    </section>
  );
};

export default Translate;
