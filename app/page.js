'use client';
import Image from 'next/image';
import OrderForm from './OrderForm';
import { useKeySequence } from './hooks/useKeySequence';

export default function Home() {
  const sequence = useKeySequence('sheena');

  return (
    <div className='container flex items-center h-screen flex-col md:flex-row'>
      <div className='w-11/12 md:w-1/2 p-10 md:p-0 max-h-screen flex justify-center items-center '>
        <Image src='/main.jpg' alt='zizi' width={500} height={800} />
      </div>
      <OrderForm />;
    </div>
  );
}
