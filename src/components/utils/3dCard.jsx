import React, { useState, useRef, useEffect } from 'react';
import { animated, useSpring } from '@react-spring/web';
import Draggable from 'react-draggable';

const CARD_WIDTH = 300;
const CARD_HEIGHT = 180;

const Card3D = ({ cardImage, cardText, cardColor, textColor, fontFamily, isDarkMode, useColorPicker, useGradient, gradientType, gradientAngle, gradientColor1, gradientColor2, isEditMode, overlayColor, overlayOpacity }) => {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  const [{ xRotation, yRotation, scale }, api] = useSpring(() => ({
    xRotation: 0,
    yRotation: 0,
    scale: 1,
    config: { mass: 5, tension: 350, friction: 40 }
  }));

  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [logoPosition, setLogoPosition] = useState({ x: 16, y: 16 });
  const [numberPosition, setNumberPosition] = useState({ x: 16, y: 16 });

  const cardRef = useRef(null);
  const textRef = useRef(null);
  const logoRef = useRef(null);
  const numberRef = useRef(null);

  const constrainPosition = (position, elementRef) => {
    if (!elementRef.current) return position;
    const element = elementRef.current;
    const elementRect = element.getBoundingClientRect();
    
    return {
      x: Math.max(0, Math.min(position.x, CARD_WIDTH - elementRect.width)),
      y: Math.max(0, Math.min(position.y, CARD_HEIGHT - elementRect.height))
    };
  };

  const handleDrag = (setPositionFunc, elementRef) => (e, data) => {
    const constrained = constrainPosition({ x: data.x, y: data.y }, elementRef);
    setPositionFunc(constrained);
  };

  const handleStart = (e) => {
    if (isEditMode) return;
    setIsDragging(true);
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    setStartY(e.touches ? e.touches[0].clientY : e.clientY);
  };

  const handleMove = (e) => {
    if (isEditMode || !isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    setRotationY(rotationY + deltaX);
    setRotationX(rotationX - deltaY);

    setStartX(clientX);
    setStartY(clientY);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setRotationX(0);
    setRotationY(0);
  };

  useEffect(() => {
    api.start({
      xRotation: rotationX % 360,
      yRotation: rotationY % 360,
      scale: isDragging ? 1.1 : 1,
    });
  }, [rotationX, rotationY, isDragging, api]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, startX, startY]);

  const adjustColor = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  };

  const getBackgroundStyle = () => {
    if (!useColorPicker && cardImage) {
      return {
        backgroundImage: `url(${cardImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    } else if (useColorPicker) {
      if (useGradient) {
        if (gradientType === 'linear') {
          return {
            background: `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`,
          };
        } else if (gradientType === 'radial') {
          return {
            background: `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`,
          };
        }
      } else {
        return {
          background: `linear-gradient(145deg, ${cardColor}, ${adjustColor(cardColor, -20)})`,
        };
      }
    }
    return { backgroundColor: '#cccccc' };
  };

  return (
    <div className="relative">
      <animated.div
        ref={cardRef}
        onMouseDown={isEditMode ? null : handleStart}
        onTouchStart={isEditMode ? null : handleStart}
        style={{
          transform: 'perspective(1000px)',
          transformStyle: 'preserve-3d',
          scale,
          rotateX: xRotation.to(val => `${val}deg`),
          rotateY: yRotation.to(val => `${val}deg`),
          cursor: isDragging ? 'grabbing' : 'grab',
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          position: 'relative',
          userSelect: 'none',
          touchAction: 'none',
          pointerEvents: 'auto',
          overflow: 'hidden',
        }}
        className="shadow-xl card-3d"
      >
        <div style={{
          ...getBackgroundStyle(),
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          overflow: 'hidden',
        }}>
          <div 
            className="absolute inset-0" 
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity / 100,
              mixBlendMode: 'multiply',
            }}
          />
          <Draggable
            position={textPosition}
            onDrag={handleDrag(setTextPosition, textRef)}
            disabled={!isEditMode}
          >
            <span ref={textRef} className={`text-xl font-semibold absolute z-10 ${isEditMode ? 'cursor-move' : ''}`} style={{ color: textColor, fontFamily: fontFamily }}>
              {cardText}
            </span>
          </Draggable>
          <animated.div 
            className="absolute inset-0"
            style={{
              background: xRotation.to((x) => yRotation.to((y) => {
                const xOffset = (50 + (y / 30) * 50).toFixed(2);
                const yOffset = (50 - (x / 30) * 50).toFixed(2);
                return `radial-gradient(circle at ${xOffset}% ${yOffset}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`
              })),
              mixBlendMode: 'soft-light',
            }}
          />
          <Draggable
            position={logoPosition}
            onDrag={handleDrag(setLogoPosition, logoRef)}
            disabled={!isEditMode}
          >
            <div ref={logoRef} className={`absolute w-8 h-8 flex items-center justify-center ${isEditMode ? 'cursor-move' : ''}`} style={{ left: logoPosition.x, top: logoPosition.y }}>
              <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center`} style={{ borderColor: textColor }}>
                <div className={`w-4 h-4 border-t-2 border-l-2 rounded-tl-full`} style={{ borderColor: textColor }}></div>
              </div>
            </div>
          </Draggable>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-2 rounded-full flex items-center justify-center" style={{ borderColor: textColor }}>
            <div className="w-8 h-8 border-2 rounded-full" style={{ borderColor: textColor }}></div>
          </div>
          <Draggable
            position={numberPosition}
            onDrag={(e, data) => {
              const newY = Math.min(Math.max(data.y, 0), CARD_HEIGHT - 32);
              setNumberPosition({ x: data.x, y: newY });
            }}
            disabled={!isEditMode}
            bounds="parent"
          >
            <div 
              ref={numberRef} 
              className={`absolute text-xs font-mono ${isEditMode ? 'cursor-move' : ''}`} 
              style={{ 
                color: textColor, 
                left: numberPosition.x, 
                bottom: numberPosition.y,
                maxWidth: CARD_WIDTH - 32,
                wordBreak: 'break-all'
              }}
            >
              1234 5678 9012 3456
            </div>
          </Draggable>
          
          {/* Add shine effect */}
          <animated.div 
            className="card-shine"
            style={{
              position: 'absolute',
              top: 0,
              left: xRotation.to(val => `${val * 2}px`),
              width: '200%',
              height: '100%',
              opacity: 0.3,
              background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)',
              transform: 'skewX(-20deg)',
            }}
          />
        </div>

        <div style={{
          ...getBackgroundStyle(),
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          borderRadius: '10px',
          transform: 'rotateY(180deg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box',
          backgroundColor: cardColor,
          zIndex: 1,
        }}>
          <span style={{ 
            color: textColor, 
            fontFamily: fontFamily,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            {cardText}
          </span>
          <div style={{
            color: textColor,
            fontFamily: 'monospace',
            fontSize: '1rem',
          }}>
            1234 5678 9012 3456
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default Card3D;
