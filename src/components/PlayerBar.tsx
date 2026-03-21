{isFullscreen && canPlay && (
  <div className="fixed inset-0 z-[999] bg-black flex flex-col">

    {/* Background */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${track.albumArt})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(80px)',
        opacity: 0.25,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full">

      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <p className="text-xs text-gray-400 uppercase">Now Playing</p>
          <p className="text-sm text-white">{track.artist}</p>
        </div>

        <button
          onClick={() => setIsFullscreen(false)}
          className="text-sm bg-white/10 px-4 py-2 rounded-full hover:bg-white/20"
        >
          Close
        </button>
      </div>

      {/* Center */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">

        {/* BIG VIDEO */}
        <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <iframe
            src={youtubeUrl}
            className="w-full h-full"
            allowFullScreen
          />
        </div>

        {/* Song Info */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold">{track.title}</h1>
          <p className="text-gray-400 mt-1">{track.artist}</p>
        </div>

        {/* Progress */}
        <div className="w-full max-w-3xl mt-6">
          <div
            onClick={handleProgressClick}
            className="h-2 bg-white/10 rounded-full cursor-pointer"
          >
            <div
              className="h-2 bg-[#1DB954] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatTime(currentSecs)}</span>
            <span>{formatTime(track.duration || 0)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-8">

          <button onClick={onPrev} className="text-2xl text-gray-300 hover:text-white">
            ⏮
          </button>

          <button
            onClick={onTogglePlay}
            className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center text-black text-2xl"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button onClick={onNext} className="text-2xl text-gray-300 hover:text-white">
            ⏭
          </button>

        </div>

        {/* Extra controls */}
        <div className="flex gap-4 mt-6">
          <button onClick={onShuffle} className={shuffle ? 'text-green-400' : 'text-gray-400'}>
            Shuffle
          </button>
          <button onClick={onRepeat} className={repeat ? 'text-green-400' : 'text-gray-400'}>
            Repeat
          </button>
          <button onClick={onLike} className={liked ? 'text-green-400' : 'text-gray-400'}>
            Like
          </button>
        </div>

        {/* Volume */}
        <div className="w-full max-w-xs mt-6">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => onVolumeChange(Number(e.target.value))}
            className="w-full accent-[#1DB954]"
          />
        </div>

      </div>
    </div>
  </div>
)}
