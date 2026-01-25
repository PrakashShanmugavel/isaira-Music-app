import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";

export default function Player() {
  const context = useContext(PlayerContext);
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const currentSong = context?.currentSong;

  // ✅ ALWAYS CALL THE HOOK
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    audioRef.current.play();
    setIsPlaying(true);
  }, [currentSong]);

  // ✅ CONDITIONAL RENDER (SAFE)
  if (!currentSong) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();

    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-6 py-3 flex items-center gap-6 z-50">
      <div className="flex items-center gap-4 w-1/4">
        <img
          src={currentSong.imageUrl}
          className="w-14 h-14 rounded object-cover"
        />
        <div>
          <p className="font-semibold text-white">{currentSong.title}</p>
          <p className="text-sm text-gray-400">{currentSong.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-2/4">
        <button onClick={togglePlay} className="text-xl text-white">
          {isPlaying ? "⏸" : "▶️"}
        </button>

        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-400">{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={progress}
            onChange={(e) => {
              audioRef.current.currentTime = e.target.value;
              setProgress(e.target.value);
            }}
            className="w-full accent-green-500"
          />
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-1/4 justify-end">
        🔊
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            audioRef.current.volume = e.target.value;
            setVolume(e.target.value);
          }}
          className="accent-green-500 w-24"
        />
      </div>

      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={onTimeUpdate}
      />
    </div>
  );
}
