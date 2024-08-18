import React from 'react';

interface Step {
    number: number;
    label: string;
    isActive: boolean;
}

interface StepProps {
    steps: Step[];
}

const Steps: React.FC<StepProps> = ({ steps }) => {
    return (
        <div className="flex items-center justify-between w-full lg:w-[900px]">
            {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${step.isActive ? 'border border-blue-500' : 'bg-gray-300 text-gray-500'
                                }`}
                        >
                            {step.number}
                        </div>
                        <span className="ml-2 text-sm">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className="flex-grow h-px bg-gray-300 mx-4"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};


export default Steps
