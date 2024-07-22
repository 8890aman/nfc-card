import React, { useState, useRef, useEffect } from 'react';
import { animated, useSpring } from '@react-spring/web';
import Draggable from 'react-draggable';
import { QRCodeSVG } from 'qrcode.react';

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
  const [numberPosition, setNumberPosition] = useState({ x: 16, y: 16 });
  const [qrCodeData, setQrCodeData] = useState('https://example.com');

  const cardRef = useRef(null);
  const textRef = useRef(null);
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

  const getShineStyle = () => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: xRotation.to((x) => yRotation.to((y) => {
      const xPercentage = (50 + y / 3).toFixed(2);
      const yPercentage = (50 - x / 3).toFixed(2);
      return `linear-gradient(${xPercentage}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%), 
              radial-gradient(circle at ${xPercentage}% ${yPercentage}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`;
    })),
    opacity: 0.6,
    mixBlendMode: 'soft-light',
  });

  const getShadowStyle = (x, y) => {
    if (isDarkMode) return {};
    const shadowX = -y / 20;
    const shadowY = x / 20;
    const shadowBlur = Math.sqrt(x * x + y * y) / 5;
    return {
      boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.3)`,
    };
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
          ...xRotation.to(x => yRotation.to(y => getShadowStyle(x, y))),
        }}
        className="card-3d rounded-xl"
      >
        {/* Front of the card */}
        <animated.div
          style={{
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
            rotateY: yRotation.to(y => `${y}deg`),
          }}
        >
          <div 
            className="absolute inset-0" 
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity / 100,
              mixBlendMode: 'multiply',
            }}
          />
          <animated.div style={getShineStyle()} />
          <Draggable
            position={textPosition}
            onDrag={handleDrag(setTextPosition, textRef)}
            disabled={!isEditMode}
          >
            <span ref={textRef} className={`text-2xl font-bold absolute z-10 ${isEditMode ? 'cursor-move' : ''}`} style={{ color: textColor, fontFamily: fontFamily, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {cardText}
            </span>
          </Draggable>
       
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
              className={`absolute text-sm font-mono ${isEditMode ? 'cursor-move' : ''}`} 
              style={{ 
                color: textColor, 
                left: numberPosition.x, 
                bottom: numberPosition.y,
                maxWidth: CARD_WIDTH - 32,
                wordBreak: 'break-all',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                letterSpacing: '0.1em'
              }}
            >
             ZapTag
            </div>
          </Draggable>
        </animated.div>

        {/* Back of the card */}
        <animated.div
          style={{
            ...getBackgroundStyle(),
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            rotateY: yRotation.to(y => `${y + 180}deg`),
          }}
        >
          <div 
            className="absolute inset-0" 
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity / 100,
              mixBlendMode: 'multiply',
            }}
          />
          <animated.div style={getShineStyle()} />
          <div className="flex flex-col items-center justify-center h-full">
            <QRCodeSVG 
              value={qrCodeData}
              size={CARD_WIDTH / 3}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
            />
          </div>
        </animated.div>
      </animated.div>
    </div>
  );
};

export default Card3D;