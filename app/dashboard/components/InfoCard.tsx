"use client";
import React from 'react';
import CountUp from 'react-countup';

const TONES = {
    blue: 'bg-primary-500',
    green: 'bg-success-500',
    yellow: 'bg-warning-500',
};

interface InfoCardProps {
    title: string;
    start?: number;
    count: number;
    icon?: React.ReactNode;
    tone?: keyof typeof TONES;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, start, count, icon, tone = 'blue' }) => {
    return (
        <div className='flex items-start justify-between gap-3 rounded-lg border border-divider bg-content1 p-4'>
            <div>
                <p className='text-[13px] font-medium text-default-600'>{title}</p>
                <p className='mt-2 text-[28px] font-bold leading-none text-default-900'>
                    <CountUp start={start} end={count} separator=',' />
                </p>
            </div>
            {icon && (
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white [&_svg]:h-5 [&_svg]:w-5 ${TONES[tone]}`}>
                    {icon}
                </span>
            )}
        </div>
    );
};

export default InfoCard;
