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
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface ResumePreviewProps {
    data: ResumeData;
    template: TemplateId;
    isBuilder?: boolean;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, isBuilder = false }) => {
    const [zoom, setZoom] = React.useState<'fit' | '50' | '75' | '100'>('fit');
    const [contentHeight, setContentHeight] = React.useState(1123);
    const [containerWidth, setContainerWidth] = React.useState(794);

    const outerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    // 1. Monitor container width for Auto Fit zoom calculation
    React.useEffect(() => {
        if (!isBuilder) return;
        if (outerRef.current) {
            const observer = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    setContainerWidth(entry.contentRect.width);
                }
            });
            observer.observe(outerRef.current);
            return () => observer.disconnect();
        }
    }, [isBuilder]);

    // 2. Monitor content height for dynamic page break calculation
    React.useEffect(() => {
        if (contentRef.current) {
            const observer = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    setContentHeight(entry.target.scrollHeight);
                }
            });
            observer.observe(contentRef.current);
            return () => observer.disconnect();
        }
    }, []);

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

    // 3. Compute scale factor
    let scale = 1;
    if (isBuilder) {
        if (zoom === 'fit') {
            // Leave a small padding for aesthetic breathing room (e.g. 16px)
            scale = Math.min(1.2, (containerWidth - 16) / 794);
        } else {
            scale = parseFloat(zoom) / 100;
        }
    }

    const scaledHeight = contentHeight * scale;

    // A4 height in pixels (at 96 DPI, A4 is 794px width by 1123px height)
    const pageGuidesCount = Math.ceil(contentHeight / 1123);
    const pageGuides = [];
    for (let i = 1; i < pageGuidesCount; i++) {
        pageGuides.push(i * 1123);
    }

    if (!isBuilder) {
        return (
            <div 
                id="resume-preview-content" 
                className="bg-white text-black shadow-lg w-full aspect-[8.5/11] h-full min-h-full"
                style={{ backgroundColor: '#ffffff', color: '#000000' }}
            >
                <div className="bg-white w-full h-full min-h-full">
                    {renderTemplate()}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full items-center select-none">
            {/* Zoom Controls Bar */}
            <div className="flex items-center justify-between w-full bg-card/60 backdrop-blur-md border rounded-xl p-2 px-4 shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Maximize className="h-3.5 w-3.5" />
                    Preview Zoom
                </span>
                <div className="flex gap-1.5">
                    {(['fit', '50', '75', '100'] as const).map((z) => (
                        <button
                            key={z}
                            onClick={() => setZoom(z)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                                zoom === z 
                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                    : 'bg-background hover:bg-accent hover:text-accent-foreground border-border text-muted-foreground'
                            }`}
                        >
                            {z === 'fit' ? 'Auto Fit' : `${z}%`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scaled Preview Viewport */}
            <div 
                ref={outerRef} 
                className="w-full relative bg-muted/20 border rounded-2xl shadow-inner flex justify-center overflow-hidden transition-all duration-300"
                style={{ height: `${scaledHeight}px`, minHeight: '300px' }}
            >
                {/* Fixed-Width A4 Container (Always exactly 794px layout width) */}
                <div
                    ref={contentRef}
                    id="resume-preview-content"
                    className="absolute bg-white text-black shadow-2xl transition-transform duration-200"
                    style={{
                        width: '794px',
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        left: '50%',
                        marginLeft: '-397px', // Exactly half of 794px to center the element
                        top: '0',
                    }}
                >
                    <div className="bg-white w-full min-h-[1123px] select-text relative">
                        {renderTemplate()}
                        
                        {/* Page break indicators for editor assistance */}
                        {pageGuides.map((top, idx) => (
                            <div 
                                key={idx}
                                className="page-break-guide absolute left-0 right-0 border-t-2 border-dashed border-destructive/40 z-30 pointer-events-none flex justify-center"
                                style={{ top: `${top}px` }}
                            >
                                <span className="bg-destructive/10 text-destructive text-[10px] font-mono font-bold px-2 py-0.5 rounded-full -translate-y-1/2 shadow-sm border border-destructive/20 backdrop-blur-sm uppercase tracking-wider">
                                    Page {idx + 1} Break (A4 Boundary)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
