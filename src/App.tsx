import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, Target, Plus, RotateCcw, Play, Zap, Clock } from 'lucide-react';
import { useGameLogic } from './hooks/useGameLogic';
import { GameMode, GRID_COLS, GRID_ROWS } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [mode, setMode] = React.useState<GameMode | null>(null);
  const {
    grid,
    targetSum,
    currentSum,
    score,
    isGameOver,
    successMessage,
    timeLeft,
    handleBlockClick,
    initGame
  } = useGameLogic(mode);

  const handleStart = (selectedMode: GameMode) => {
    setMode(selectedMode);
    // Game will init via useEffect or manual call
  };

  React.useEffect(() => {
    if (mode) {
      initGame();
    }
  }, [mode, initGame]);

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-pink-500 to-purple-600 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-2xl mb-4 rotate-3 shadow-lg">
              <Plus size={32} />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-black mb-2">数字冲刺</h1>
            <p className="text-black/60 italic font-serif">终极数学消除挑战</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleStart('classic')}
              className="w-full group relative overflow-hidden bg-black text-white p-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Zap className="text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">经典模式</div>
                  <div className="text-sm text-white/60">每次消除后新增一行</div>
                </div>
              </div>
              <Play size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => handleStart('time')}
              className="w-full group relative overflow-hidden bg-white border-2 border-black text-black p-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black/5 rounded-xl">
                  <Clock className="text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">计时模式</div>
                  <div className="text-sm text-black/60">每 10 秒强制新增一行</div>
                </div>
              </div>
              <Play size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-black/5 text-center text-[10px] text-black/40 uppercase tracking-widest font-mono">
            玩法：选择数字使其总和等于目标值。不要让方块触顶！
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-pink-500 to-purple-600 flex flex-col items-center p-4 md:p-8 font-sans select-none">
      {/* HUD */}
      <div className="w-full max-w-[400px] mb-6 grid grid-cols-2 gap-4">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-black/10" />
          <div className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Target size={10} /> 目标和
          </div>
          <div className="text-4xl font-bold tracking-tighter">{targetSum}</div>
        </div>
        
        <div className={cn(
          "bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20 flex flex-col items-center justify-center transition-colors relative overflow-hidden",
          currentSum > targetSum ? "bg-red-50 border-red-200" : ""
        )}>
          <div className="absolute top-0 left-0 w-full h-1 bg-black/10" />
          <div className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1 flex items-center gap-1">
            当前和
          </div>
          <div className={cn(
            "text-4xl font-bold tracking-tighter transition-all",
            currentSum > targetSum ? "text-red-500 scale-110" : "text-black"
          )}>
            {currentSum}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[400px] mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-black text-white rounded-lg shadow-md">
            <Trophy size={16} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-black/40 uppercase tracking-widest leading-none">得分</div>
            <div className="text-xl font-bold tracking-tighter">{score}</div>
          </div>
        </div>

        {mode === 'time' && (
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-lg transition-colors shadow-md",
              timeLeft <= 3 ? "bg-red-500 text-white animate-pulse" : "bg-blue-600 text-white"
            )}>
              <Timer size={16} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-black/40 uppercase tracking-widest leading-none">剩余时间</div>
              <div className={cn(
                "text-xl font-bold tracking-tighter",
                timeLeft <= 3 ? "text-red-500" : "text-black"
              )}>
                {timeLeft}秒
              </div>
            </div>
          </div>
        )}


        <button 
          onClick={() => setMode(null)}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <RotateCcw size={20} className="text-black/40" />
        </button>
      </div>

      {/* Game Board */}
      <div 
        className="bg-white/90 backdrop-blur-md p-3 rounded-3xl shadow-2xl border-4 border-white/20 relative"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gap: '8px',
          width: '100%',
          maxWidth: '400px',
          aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`
        }}
      >
        {/* Danger Zone Indicator */}
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-red-500/20 to-transparent pointer-events-none rounded-t-2xl" />
        
        <AnimatePresence mode="popLayout">
          {grid.flat().map((block, index) => {
            const row = Math.floor(index / GRID_COLS);
            const col = index % GRID_COLS;
            
            if (block.value === 0) return <div key={`empty-${index}`} className="w-full h-full" />;

            return (
              <motion.button
                key={block.id}
                layoutId={block.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBlockClick(row, col)}
                className={cn(
                  "w-full h-full rounded-xl flex items-center justify-center text-2xl font-bold transition-all shadow-sm border-2",
                  block.isSelected 
                    ? "bg-black text-white border-black scale-105 z-10 shadow-lg" 
                    : "bg-white text-black border-black/5 hover:border-black/20"
                )}
              >
                {block.value}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
            exit={{ scale: 2, opacity: 0, rotate: 20 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.5 
                }}
                className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]"
              >
                <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center px-12 text-center">
                <span className="text-white text-3xl font-black tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-tight">
                  {successMessage}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={40} />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter mb-2">游戏结束</h2>
              <p className="text-black/60 mb-8">方块触顶了！</p>
              
              <div className="bg-black/5 rounded-2xl p-6 mb-8">
                <div className="text-[10px] font-mono text-black/40 uppercase tracking-widest mb-1">最终得分</div>
                <div className="text-5xl font-bold tracking-tighter">{score}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={initGame}
                  className="bg-black text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                >
                  再试一次
                </button>
                <button
                  onClick={() => setMode(null)}
                  className="bg-black/5 text-black py-4 rounded-2xl font-bold hover:bg-black/10 transition-all"
                >
                  返回主菜单
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Instructions */}
      <div className="mt-8 text-center text-white/60 text-xs font-mono uppercase tracking-widest max-w-[300px] drop-shadow-md">
        选择数字以达到目标值。超过目标值将重置选择。
      </div>
    </div>
  );
}
