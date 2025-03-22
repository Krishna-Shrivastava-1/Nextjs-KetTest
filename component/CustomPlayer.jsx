'use client'
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Maximize, Minimize } from "lucide-react";
import { Settings } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
const VideoPlayer = ({ src, setcross }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState("00:00");
    const [totalDuration, setTotalDuration] = useState("00:00");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [showsettings, setshowsettings] = useState(false)

    const [loading, setLoading] = useState(true); // State to manage loading

    useEffect(() => {
        const video = videoRef.current;

        video.addEventListener("waiting", () => setLoading(true)); // When buffering
        video.addEventListener("canplay", () => setLoading(false)); // When ready

        return () => {
            video.removeEventListener("waiting", () => setLoading(true));
            video.removeEventListener("canplay", () => setLoading(false));
        };
    }, []);
    let hideControlsTimeout = useRef(null);

    useEffect(() => {
        const video = videoRef.current;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setTotalDuration(formatTime(video.duration));
            });
        } else {
            video.src = src;
        }

        video.addEventListener("loadedmetadata", () => {
            setTotalDuration(formatTime(video.duration));
        });

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("contextmenu", (e) => e.preventDefault());

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("contextmenu", (e) => e.preventDefault());
        };
    }, [src]);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video.duration) {
            setProgress((video.currentTime / video.duration) * 100);
            setCurrentTime(formatTime(video.currentTime));
        }
    };

    const handleSeek = (e) => {
        const newTime = (e.target.value * videoRef.current.duration) / 100;
        videoRef.current.currentTime = newTime;
        setProgress(e.target.value);
    };

    const togglePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        videoRef.current.muted = !videoRef.current.muted;
        setMuted(videoRef.current.muted);
    };

    const handleVolumeChange = (e) => {
        videoRef.current.volume = e.target.value;
        setVolume(e.target.value);
        setMuted(e.target.value === "0");
    };

    const seekForward = () => {
        videoRef.current.currentTime += 10;
    };

    const seekBackward = () => {
        videoRef.current.currentTime -= 10;
    };

    // const toggleFullScreen = () => {
    //     if (!document.fullscreenElement) {
    //         if (playerRef.current.requestFullscreen) {
    //             playerRef.current.requestFullscreen();
    //         } else if (playerRef.current.webkitRequestFullscreen) {
    //             playerRef.current.webkitRequestFullscreen();
    //         } else if (playerRef.current.mozRequestFullScreen) {
    //             playerRef.current.mozRequestFullScreen();
    //         }
    //     } else {
    //         if (document.exitFullscreen) {
    //             document.exitFullscreen();
    //         } else if (document.webkitExitFullscreen) {
    //             document.webkitExitFullscreen();
    //         } else if (document.mozCancelFullScreen) {
    //             document.mozCancelFullScreen();
    //         }
    //     }
    // };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
            if (document.fullscreenElement) {
                playerRef.current.classList.add("fullscreen-landscape");
            } else {
                playerRef.current.classList.remove("fullscreen-landscape");
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const formatTime = (time) => {
        if (isNaN(time)) return "00:00";
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        return hours > 0
            ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            : `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    // Hide controls after inactivity
    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(hideControlsTimeout.current);
        hideControlsTimeout.current = setTimeout(() => {
            setShowControls(false);

        }, 3000);
    };
    useEffect(() => {
        setcross(showControls);
    }, [showControls, setcross]);
    const [audioTracks, setAudioTracks] = useState([]);
    const [qualityLevels, setQualityLevels] = useState([]);
    const [subtitleTracks, setSubtitleTracks] = useState([]);
    const [hlsInstance, setHlsInstance] = useState(null);

    useEffect(() => {
        const video = videoRef.current;
        if (Hls.isSupported()) {
            const hls = new Hls({
                // Adjust buffer settings
                liveSyncMaxLatencyDuration: 15, // buffer ahead 15 seconds
                maxBufferLength: 60, // Maximum buffer length
                maxMaxBufferLength: 120, // absolute max buffer length
            });
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

    const toggleFullScreen = () => {
        const videoElement = document.documentElement; // Select the whole document for fullscreen

        if (!document.fullscreenElement) {
            if (videoElement.requestFullscreen) {
                videoElement.requestFullscreen().then(() => {
                    setIsFullscreen(true);
                    if (screen.orientation && screen.orientation.lock) {
                        screen.orientation.lock("landscape").catch(err => console.log(err));
                    }
                });
            } else if (videoElement.mozRequestFullScreen) {
                videoElement.mozRequestFullScreen();
                setIsFullscreen(true);
            } else if (videoElement.webkitRequestFullscreen) {
                videoElement.webkitRequestFullscreen();
                setIsFullscreen(true);
            } else if (videoElement.msRequestFullscreen) {
                videoElement.msRequestFullscreen();
                setIsFullscreen(true);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
                setIsFullscreen(false);
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
                setIsFullscreen(false);
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div
            ref={playerRef}
            className={`relative w-full  mx-auto bg-black rounded-md overflow-hidden ${isFullscreen ? "fixed inset-0 h-screen w-screen" : ""} `}
            onMouseMove={handleMouseMove}

        >
            {/* Loader Overlay */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <LoaderCircle size={60} className="animate-spin text-red-700" />
                </div>
            )}

            {
                showsettings ?
                    <video
                        ref={videoRef}
                        width="100%"
                        height="100%"
                        tabIndex={0}
                        className="rounded-md object-contain w-full h-full"
                        onClick={() => {

                            setshowsettings(false)
                        }


                        }
                    />
                    :
                    <video
                        ref={videoRef}
                        width="100%"
                        height="100%"
                        autoPlay
                        preload="auto"
                        tabIndex={0}
                        className="rounded-md object-contain w-full h-full"
                        onClick={() => {
                            togglePlayPause()
                            setshowsettings(false)
                        }


                        }
                    />

            }


            {/* Controls */}
            <div style={{ paddingBottom: '10px' }}
                className={`absolute bottom-0 w-full bg-black/60 p-2 rounded-md hidden md:flex flex-col items-center transition-all duration-300 
        ${showControls || !isFullscreen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
                <div className="flex items-center justify-center w-full">
                    <input
                        type="range"
                        value={progress}
                        onChange={handleSeek}
                        style={{
                            background: `linear-gradient(to right, red ${progress}%, grey ${progress}%)`,
                            accentColor: "red",
                            height: "4px", // Slimmer seek bar
                            cursor: "pointer",
                            marginBottom: '11px',
                            marginLeft: '10px',
                            marginRight: '10px'
                        }}
                        className="w-full appearance-none rounded-lg  "
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-around w-full items-center">
                    <div className="flex items-center gap-x-3 select-none">
                        <button className="flex select-none cursor-pointer items-center flex-row-reverse justify-center gap-x-1.5" onClick={seekBackward}><RotateCcw size={24} />10s</button>
                        <button className="select-none cursor-pointer" onClick={togglePlayPause}>{isPlaying ? <Pause size={24} /> : <Play size={24} />}</button>
                        <button className="flex select-none cursor-pointer items-center justify-center gap-x-1.5" onClick={seekForward}><RotateCw size={24} />10s</button>
                    </div>
                    <div className="flex items-center gap-x-1">
                        <button onClick={toggleMute}>{muted ? <VolumeX size={24} /> : <Volume2 size={24} />}</button>
                        <input
                            style={{
                                background: `linear-gradient(to right, red ${progress}%, grey ${progress}%)`,
                                accentColor: "white",
                                height: "4px", // Slimmer seek bar
                                cursor: "pointer",

                            }}

                            type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-20 cursor-pointer" />
                        <span className="text-sm select-none cursor-default">{currentTime} / {totalDuration}</span>
                    </div>
                    <div className="flex items-center gap-x-5">
                        <div className="relative select-none">
                            {
                                showsettings ?
                                    <div className="cursor-pointer select-none" onClick={() => setshowsettings(false)}>
                                        <Settings />
                                    </div>
                                    :

                                    <div className="cursor-pointer select-none" onClick={() => setshowsettings(true)}>
                                        <Settings />
                                    </div>
                            }

                            {showsettings && <div className="absolute  bottom-8 bg-black w-42 right-0">
                                {/* Video Quality Selection */}
                                {qualityLevels.length > 0 && (
                                    <div>
                                        <label>Select Video Quality: </label>
                                        <select className="bg-zinc-800" onChange={(e) => changeQuality(parseInt(e.target.value, 10))}>
                                            {qualityLevels.map((level, index) => (
                                                <option key={index} value={index}>
                                                    {level.height ? `${level.height}p` : `Level ${index + 1}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {audioTracks.length > 0 && (
                                    <div>
                                        <label>Select Audio Track: </label>
                                        <select className="bg-zinc-800" onChange={(e) => changeAudioTrack(parseInt(e.target.value, 10))}>
                                            {audioTracks.map((track, index) => (
                                                <option key={index} value={index}>
                                                    {track.name || `Track ${index + 1}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
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
                            </div>}
                        </div>

                        <button className="cursor-pointer select-none" onClick={toggleFullScreen}>{isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}</button>


                    </div>
                </div>

                {/* Seek Bar (Slimmer) */}
                {/* <input
          type="range"
          value={progress}
          onChange={handleSeek}
          style={{
            background: `linear-gradient(to right, red ${progress}%, black ${progress}%)`,
            accentColor: "red",
            height: "4px", // Slimmer seek bar
            cursor: "pointer",
          }}
          className="w-full appearance-none rounded-lg"
        /> */}




                {/* Subtitle Selection */}

            </div>
            <div     style={{
        paddingBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        top: isFullscreen ? 'env(safe-area-inset-top)' : 'auto', // Top in fullscreen, auto otherwise
        bottom: isFullscreen ? 'auto' : 'env(safe-area-inset-bottom)', // Auto in fullscreen, bottom otherwise
    }}
    className={`w-full bg-black/60 p-2 rounded-md md:hidden flex flex-col items-center transition-all duration-300 ${
        showControls || !isFullscreen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
            >
                <div className="flex items-center justify-center w-full">
                    <input
                        type="range"
                        value={progress}
                        onChange={handleSeek}
                        style={{
                            background: `linear-gradient(to right, red ${progress}%, grey ${progress}%)`,
                            accentColor: "red",
                            height: "4px", // Slimmer seek bar
                            cursor: "pointer",
                            marginBottom: '11px',
                            marginLeft: '10px',
                            marginRight: '10px'
                        }}
                        className="w-full appearance-none rounded-lg  "
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-around flex-wrap w-full items-center">
                    <div className="flex items-center gap-x-3 select-none">
                        <button className="flex select-none cursor-pointer items-center flex-row-reverse justify-center gap-x-1.5" onClick={seekBackward}><RotateCcw size={24} />10s</button>
                        <button className="select-none cursor-pointer" onClick={togglePlayPause}>{isPlaying ? <Pause size={24} /> : <Play size={24} />}</button>
                        <button className="flex select-none cursor-pointer items-center justify-center gap-x-1.5" onClick={seekForward}><RotateCw size={24} />10s</button>
                    </div>
                    <div className="flex items-center gap-x-1">
                        <button onClick={toggleMute}>{muted ? <VolumeX size={24} /> : <Volume2 size={24} />}</button>
                        <input
                            style={{
                                background: `linear-gradient(to right, red ${progress}%, grey ${progress}%)`,
                                accentColor: "white",
                                height: "4px", // Slimmer seek bar
                                cursor: "pointer",

                            }}

                            type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-20 cursor-pointer" />
                        <span className="text-sm select-none cursor-default">{currentTime} / {totalDuration}</span>
                    </div>
                    <div className="flex items-center gap-x-5">
                        <div className="relative select-none">
                            {
                                showsettings ?
                                    <div className="cursor-pointer select-none" onClick={() => setshowsettings(false)}>
                                        <Settings />
                                    </div>
                                    :

                                    <div className="cursor-pointer select-none" onClick={() => setshowsettings(true)}>
                                        <Settings />
                                    </div>
                            }

                            {showsettings && <div className="absolute  bottom-8 bg-black w-42 right-0">
                                {/* Video Quality Selection */}
                                {qualityLevels.length > 0 && (
                                    <div>
                                        <label>Select Video Quality: </label>
                                        <select className="bg-zinc-800" onChange={(e) => changeQuality(parseInt(e.target.value, 10))}>
                                            {qualityLevels.map((level, index) => (
                                                <option key={index} value={index}>
                                                    {level.height ? `${level.height}p` : `Level ${index + 1}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {audioTracks.length > 0 && (
                                    <div>
                                        <label>Select Audio Track: </label>
                                        <select className="bg-zinc-800" onChange={(e) => changeAudioTrack(parseInt(e.target.value, 10))}>
                                            {audioTracks.map((track, index) => (
                                                <option key={index} value={index}>
                                                    {track.name || `Track ${index + 1}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
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
                            </div>}
                        </div>

                        <button className="cursor-pointer select-none" onClick={toggleFullScreen}>{isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}</button>


                    </div>
                </div>

                {/* Seek Bar (Slimmer) */}
                {/* <input
          type="range"
          value={progress}
          onChange={handleSeek}
          style={{
            background: `linear-gradient(to right, red ${progress}%, black ${progress}%)`,
            accentColor: "red",
            height: "4px", // Slimmer seek bar
            cursor: "pointer",
          }}
          className="w-full appearance-none rounded-lg"
        /> */}




                {/* Subtitle Selection */}

            </div>
        </div>
    );
};

export default VideoPlayer;
