'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useKeySequence = (targetSequence, callback) => {
  const [sequence, setSequence] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let timeoutId;

      const handleKeyPress = (event) => {
        // 將新按鍵添加到序列中
        const newSequence = [...sequence, event.key.toLowerCase()];

        // 只保留最後 targetSequence.length 個字符
        if (newSequence.length > targetSequence.length) {
          newSequence.shift();
        }

        setSequence(newSequence);

        // 檢查是否匹配目標序列
        if (newSequence.join('') === targetSequence) {
          if (callback) {
            callback();
          } else {
            router.push('/home');
          }
          setSequence([]); // 重置序列
        }

        // 設置重置計時器
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSequence([]);
        }, 1000); // 1秒後重置
      };

      window.addEventListener('keypress', handleKeyPress);

      return () => {
        window.removeEventListener('keypress', handleKeyPress);
        clearTimeout(timeoutId);
      };
    }
  }, [sequence, targetSequence, callback, router]);

  return sequence;
};
