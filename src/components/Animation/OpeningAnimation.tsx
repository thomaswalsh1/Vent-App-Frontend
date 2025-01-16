'use client';
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

interface BallType {
  radius: number;
  moveX: number;
  moveY: number;
  speed: number;
}

const OpeningAnimation = () => {
  const [playing, setPlaying] = useState(true);
  const [balls, setBalls] = useState<BallType[]>([]);

  useEffect(() => {
    const generateBalls = () => {
      const newBalls = Array.from({ length: 20 }, () => ({
        radius: (Math.floor(Math.random() * 10) + 1) * 10,
        moveX: Math.floor(Math.random() * 600) + 300,
        moveY: (Math.floor(Math.random() * 600) + 200) * -1,
        speed: Math.floor(Math.random() * 10)
      }));
      setBalls(newBalls);
    };
    generateBalls();
  }, []);

  useEffect(() => {
    setTimeout(() => setPlaying(false), 2000);
  }, []);

  const Ball = ({ radius }: { radius: number }) => (
    <div
      className="absolute rounded-full bg-white"
      style={{
        height: radius,
        width: radius,
      }}
    />
  );

  return (
    <div className="fixed inset-0 pointer-events-none">
      {playing && (
        <div className="relative h-full w-full">
          {balls.map((ball, index) => (
            <motion.div
              key={index}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: ball.moveX * ball.speed,
                y: ball.moveY * ball.speed,
                opacity: 0,
                transition: { duration: 2 }
              }}
              className="absolute bottom-0 left-0"
            >
              <Ball radius={ball.radius} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpeningAnimation;