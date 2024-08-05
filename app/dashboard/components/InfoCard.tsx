"use client";
import { Card, CardBody } from '@nextui-org/react';
import React from 'react';
import CountUp from 'react-countup';

interface InfoCardProps {
    title: string;
    start?: number;
    count: number;
    icon?: React.ReactNode;
    bg?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, start, count, icon, bg }) => {
    return (
        <Card className={`w-full sm:w-[300px] h-[100px] text-md font-medium ${bg ? bg : ''}`}>
            <CardBody>
                <div className='h-full flex flex-col justify-between'>
                    <p className='text-default-50 text-sm'>{title}</p>
                    <p className='text-default-50 text-3xl'>
                        <CountUp start={start} end={count} />
                    </p>
                </div>
                <div className='absolute top-3 right-3'>
                    {icon ? icon : <></>}
                </div>
            </CardBody>
        </Card>
    );
};

export default InfoCard;