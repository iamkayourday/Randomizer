// components/SpinnerWheel.jsx
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faVolumeUp, faVolumeMute, faFire } from '@fortawesome/free-solid-svg-icons';

const SpinnerWheel = ({ darkMode, participants, selectedTheme, soundEnabled, toggleSound }) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(true);
  const [particles, setParticles] = useState([]);
  const audioRef = useRef(null);

  const themes = {
    blue: 'rgba(59, 130, 246, 0.8)',
    emerald: 'rgba(16, 185, 129, 0.8)',
    violet: 'rgba(139, 92, 246, 0.8)',
    amber: 'rgba(245, 158, 11, 0.8)',
    rose: 'rgba(244, 63, 94, 0.8)',
    indigo: 'rgba(99, 102, 241, 0.8)',
  };

  const color = themes[selectedTheme] || themes.blue;

  useEffect(() => {
    if (!canvasRef.current || participants.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Draw wheel
    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw outer ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = darkMode ? '#374151' : '#f3f4f6';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();

      // Draw segments
      const segmentAngle = (Math.PI * 2) / participants.length;
      participants.forEach((_, i) => {
        const startAngle = rotation + i * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius - 2, startAngle, endAngle);
        ctx.closePath();
        
        // Alternate colors
        ctx.fillStyle = i % 2 === 0 
          ? (darkMode ? '#4b5563' : '#e5e7eb') 
          : (darkMode ? '#6b7280' : '#d1d5db');
        ctx.fill();
        ctx.strokeStyle = darkMode ? '#6b7280' : '#9ca3af';
        ctx.stroke();
      });

      // Draw center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw center icon
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎲', centerX, centerY);
    };

    drawWheel();

    // Animation loop
    let animationId;
    if (spinning) {
      const animate = () => {
        setRotation(prev => prev + 0.05);
        drawWheel();
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }

    // Generate particles
    const particleInterval = setInterval(() => {
      if (spinning) {
        const newParticle = {
          x: centerX + (Math.random() * radius * 0.8) * Math.cos(Math.random() * Math.PI * 2),
          y: centerY + (Math.random() * radius * 0.8) * Math.sin(Math.random() * Math.PI * 2),
          size: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 4,
          speedY: (Math.random() - 0.5) * 4,
          opacity: 1,
          color: ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0'][Math.floor(Math.random() * 4)],
        };
        setParticles(prev => [...prev.slice(-30), newParticle]); // Keep only 30 particles
      }
    }, 100);

    // Update particles
    const particleInterval2 = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.speedX,
          y: p.y + p.speedY,
          opacity: p.opacity - 0.02,
        })).filter(p => p.opacity > 0)
      );
    }, 16);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      clearInterval(particleInterval);
      clearInterval(particleInterval2);
    };
  }, [participants, darkMode, color, spinning, rotation]);

  // Play sound effect
  useEffect(() => {
    if (soundEnabled && spinning) {
      // Create spinning sound effect
      const playSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      };
      
      const interval = setInterval(playSound, 300);
      return () => clearInterval(interval);
    }
  }, [soundEnabled, spinning]);

  return (
    <div className={`rounded-xl border overflow-hidden shadow-xl ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">
              <FontAwesomeIcon icon={faFire} className="text-orange-500 mr-2" />
              Shuffling Participants
            </h3>
            <p className="text-sm opacity-75">Creating perfectly random groups...</p>
          </div>
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg ${
              darkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}
            title={soundEnabled ? "Mute sound" : "Unmute sound"}
          >
            <FontAwesomeIcon 
              icon={soundEnabled ? faVolumeUp : faVolumeMute} 
              className={soundEnabled ? 'text-green-500' : 'text-gray-400'}
            />
          </button>
        </div>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full max-w-md mx-auto rounded-lg"
          />
          
          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-ping"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  opacity: p.opacity,
                }}
              />
            ))}
          </div>
          
          {/* Pointer */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500 transform -translate-y-16"></div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <FontAwesomeIcon icon={faSyncAlt} className="animate-spin" />
            <span className="font-medium">Randomizing {participants.length} participants</span>
          </div>
          <p className="mt-4 text-sm opacity-75">
            Creating balanced groups with leader assignment...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpinnerWheel;