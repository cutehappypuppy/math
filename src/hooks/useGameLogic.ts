import { useState, useEffect, useCallback, useRef } from 'react';
import { Block, GRID_COLS, GRID_ROWS, INITIAL_ROWS, MAX_VALUE, MIN_TARGET, MAX_TARGET, GameMode, TIME_LIMIT } from '../types';
import confetti from 'canvas-confetti';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createRow = () => {
  return Array.from({ length: GRID_COLS }, () => ({
    id: generateId(),
    value: Math.floor(Math.random() * MAX_VALUE) + 1,
    isSelected: false,
  }));
};

export function useGameLogic(mode: GameMode | null) {
  const [grid, setGrid] = useState<Block[][]>([]);
  const [targetSum, setTargetSum] = useState(0);
  const [currentSum, setCurrentSum] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateTarget = useCallback(() => {
    setTargetSum(Math.floor(Math.random() * (MAX_TARGET - MIN_TARGET + 1)) + MIN_TARGET);
  }, []);

  const initGame = useCallback(() => {
    const initialGrid: Block[][] = Array.from({ length: GRID_ROWS }, () => 
      Array.from({ length: GRID_COLS }, () => ({ id: '', value: 0, isSelected: false }))
    );
    
    // Fill bottom rows
    for (let r = GRID_ROWS - INITIAL_ROWS; r < GRID_ROWS; r++) {
      initialGrid[r] = createRow();
    }
    
    setGrid(initialGrid);
    setScore(0);
    setIsGameOver(false);
    setCurrentSum(0);
    setTimeLeft(TIME_LIMIT);
    generateTarget();
  }, [generateTarget]);

  const addRow = useCallback(() => {
    setGrid(prev => {
      // Check if top row is occupied
      if (prev[0].some(b => b.value > 0)) {
        setIsGameOver(true);
        return prev;
      }

      const newGrid = [...prev];
      // Shift everything up
      for (let r = 0; r < GRID_ROWS - 1; r++) {
        newGrid[r] = [...newGrid[r + 1]];
      }
      // Add new row at bottom
      newGrid[GRID_ROWS - 1] = createRow();
      return newGrid;
    });
    
    if (mode === 'time') {
      setTimeLeft(TIME_LIMIT);
    }
  }, [mode]);

  const handleBlockClick = (row: number, col: number) => {
    if (isGameOver) return;
    
    const block = grid[row][col];
    if (block.value === 0) return;

    const newGrid = [...grid];
    const isSelected = !block.isSelected;
    newGrid[row][col] = { ...block, isSelected };
    
    const newSum = isSelected ? currentSum + block.value : currentSum - block.value;
    
    if (newSum === targetSum) {
      // Success!
      const selectedBlocks: {r: number, c: number}[] = [];
      newGrid.forEach((r, ri) => r.forEach((b, ci) => {
        if (b.isSelected) selectedBlocks.push({r: ri, c: ci});
      }));

      // Clear blocks
      selectedBlocks.forEach(({r, c}) => {
        newGrid[r][c] = { id: '', value: 0, isSelected: false };
      });

      // Apply gravity
      for (let c = 0; c < GRID_COLS; c++) {
        let emptySpot = GRID_ROWS - 1;
        for (let r = GRID_ROWS - 1; r >= 0; r--) {
          if (newGrid[r][c].value !== 0) {
            const temp = newGrid[r][c];
            newGrid[r][c] = { id: '', value: 0, isSelected: false };
            newGrid[emptySpot][c] = { ...temp, isSelected: false };
            emptySpot--;
          }
        }
      }

      setGrid(newGrid);
      setScore(s => s + targetSum * selectedBlocks.length);
      setCurrentSum(0);
      generateTarget();
      
      const messages = ["你爱上这个游戏了吗", "你真棒", "棒棒棒！太棒了！真厉害！"];
      setSuccessMessage(messages[Math.floor(Math.random() * messages.length)]);
      setTimeout(() => setSuccessMessage(null), 1500);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (mode === 'classic') {
        addRow();
      } else if (mode === 'time') {
        setTimeLeft(TIME_LIMIT);
      }
    } else if (newSum > targetSum) {
      // Reset selection if exceeded
      newGrid.forEach(r => r.forEach(b => b.isSelected = false));
      setGrid(newGrid);
      setCurrentSum(0);
    } else {
      setGrid(newGrid);
      setCurrentSum(newSum);
    }
  };

  // Timer for Time Mode
  useEffect(() => {
    if (mode === 'time' && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            addRow();
            return TIME_LIMIT;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, isGameOver, addRow]);

  return {
    grid,
    targetSum,
    currentSum,
    score,
    isGameOver,
    successMessage,
    timeLeft,
    handleBlockClick,
    initGame,
    setIsGameOver
  };
}
