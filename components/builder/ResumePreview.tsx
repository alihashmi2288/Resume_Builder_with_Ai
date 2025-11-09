import * as React from 'react';
import type { ResumeData, TemplateId } from '../../types';
import { ClassicTemplate } from '../templates/ClassicTemplate';
import { ModernTemplate } from '../templates/ModernTemplate';
import { CreativeTemplate } from '../templates/CreativeTemplate';
import { TechnicalTemplate } from '../templates/TechnicalTemplate';
import { MinimalistTemplate } from '../templates/MinimalistTemplate';
import { AcademicTemplate } from '../templates/AcademicTemplate';
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate';
import { InfographicTemplate } from '../templates/InfographicTemplate';
import { StartupTemplate } from '../templates/StartupTemplate';

interface ResumePreviewProps {
    data: ResumeData;
    template: TemplateId;
    isBuilder?: boolean;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, isBuilder = false }) => {
    const renderTemplate = () => {
        switch (template) {
            case 'classic':
                return <ClassicTemplate data={data} />;
            case 'modern':
                return <ModernTemplate data={data} />;
            case 'creative':
                return <CreativeTemplate data={data} />;
            case 'technical':
                return <TechnicalTemplate data={data} />;
            case 'minimalist':
                return <MinimalistTemplate data={data} />;
            case 'academic':
                return <AcademicTemplate data={data} />;
            case 'executive':
                return <ExecutiveTemplate data={data} />;
            case 'infographic':
                return <InfographicTemplate data={data} />;
            case 'startup':
                return <StartupTemplate data={data} />;
            default:
                return <ClassicTemplate data={data} />;
        }
    };

    return (
        <div 
            id="resume-preview-content" 
            className={`bg-white text-black shadow-lg w-full ${
                isBuilder 
                    ? 'overflow-auto min-h-screen' 
                    : 'aspect-[8.5/11] h-full min-h-full'
            }`}
            style={isBuilder ? {
                backgroundColor: '#ffffff !important',
                color: '#000000 !important',
                fontSize: 'clamp(7px, 1.8vw, 10px)'
            } : {}}
        >
           <div 
               className={`bg-white w-full ${
                   isBuilder 
                       ? 'min-h-full p-2 sm:p-4 md:p-6 lg:p-8' 
                       : 'h-full min-h-full'
               }`}
               style={isBuilder ? {
                   backgroundColor: '#ffffff !important',
                   minWidth: '300px',
                   wordWrap: 'break-word',
                   overflowWrap: 'break-word'
               } : {}}
           >
               {renderTemplate()}
           </div>
        </div>
    );
};
