'use client'
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [audioTracks, setAudioTracks] = useState([]);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [hlsInstance, setHlsInstance] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setAudioTracks(hls.audioTracks);
        setQualityLevels(hls.levels);
      });

      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_, data) => {
        setAudioTracks(data.audioTracks);
      });

      hls.on(Hls.Events.LEVEL_LOADED, () => {
        setQualityLevels(hls.levels);
      });

      hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, data) => {
        setSubtitleTracks(data.subtitleTracks);
      });

      setHlsInstance(hls);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, [src]);

  // Change audio track
  const changeAudioTrack = (index) => {
    if (hlsInstance) {
      hlsInstance.audioTrack = index;
    }
  };

  // Change video quality
  const changeQuality = (index) => {
    if (hlsInstance) {
      hlsInstance.currentLevel = index;
    }
  };

  // Change subtitles
  const changeSubtitleTrack = (index) => {
    if (hlsInstance) {
      hlsInstance.subtitleTrack = index;
    }
  };

  return (
    <div>
      <video ref={videoRef} controls width="640" height="360" style={{ maxWidth: "100%" }} />

      {/* Audio Track Selection */}
      {audioTracks.length > 0 && (
        <div>
          <label>Select Audio Track: </label>
          <select onChange={(e) => changeAudioTrack(parseInt(e.target.value, 10))}>
            {audioTracks.map((track, index) => (
              <option key={index} value={index}>
                {track.name || `Track ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Video Quality Selection */}
      {qualityLevels.length > 0 && (
        <div>
          <label>Select Video Quality: </label>
          <select onChange={(e) => changeQuality(parseInt(e.target.value, 10))}>
            {qualityLevels.map((level, index) => (
              <option key={index} value={index}>
                {level.height ? `${level.height}p` : `Level ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Subtitle Selection */}
      {subtitleTracks.length > 0 && (
        <div>
          <label>Select Subtitles: </label>
          <select onChange={(e) => changeSubtitleTrack(parseInt(e.target.value, 10))}>
            <option value="-1">None</option>
            {subtitleTracks.map((track, index) => (
              <option key={index} value={index}>
                {track.name || `Subtitle ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
