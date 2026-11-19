import * as React from 'react';
import type { ResumeData } from '../../types';
import { getThemeClasses } from '../../lib/colors';
import {
    cleanBulletLine,
    getHeadingCaseClass,
    getVisibleContactItems,
    normalizeSectionOrder,
    shouldRenderSection,
    type SectionId,
} from '../../lib/resumeUtils';

const SectionHeader: React.FC<{ children: React.ReactNode; theme: any; headingCaseClass: string }> = ({ children, theme, headingCaseClass }) => (
    <h2 className={`text-sm font-bold ${headingCaseClass} tracking-widest ${theme.text} border-b-2 ${theme.borderLight} pb-1 mb-3`}>
        {children}
    </h2>
);

export const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);
    const headingCaseClass = getHeadingCaseClass(data.headingCase);
    const contactItems = getVisibleContactItems(data);

    const sectionMap: Record<SectionId, () => React.ReactNode> = {
        summary: () => (
            <section className="mb-4">
                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Summary</SectionHeader>
                <p className="text-xs text-gray-800 leading-relaxed">{data.summary}</p>
            </section>
        ),
        skills: () => (
            <section className="mb-4">
                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Skills</SectionHeader>
                <p className="text-xs text-gray-800 leading-relaxed">{data.skills}</p>
            </section>
        ),
        experience: () => (
            <section className="mb-4">
                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Experience</SectionHeader>
                {data.experience.map(exp => (
                    <div key={exp.id} className="mb-3">
                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3 className="text-sm font-semibold">{exp.title}</h3>
                            <span className="text-xs font-light text-gray-600">{exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate}</span>
                        </div>
                        {exp.company && <p className="text-xs italic text-gray-700">{exp.company}</p>}
                        <ul className="list-disc list-inside mt-1 text-xs text-gray-800 space-y-1">
                            {exp.description.split('\n').map(cleanBulletLine).filter(Boolean).map((line, i) => <li key={i}>{line}</li>)}
                        </ul>
                    </div>
                ))}
            </section>
        ),
        education: () => (
            <section className="mb-4">
                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Education</SectionHeader>
                {data.education.map(edu => (
                    <div key={edu.id} className="mb-2">
                         <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3 className="text-sm font-semibold">{edu.university}</h3>
                            <span className="text-xs font-light text-gray-600">{edu.startDate}{edu.startDate && edu.endDate ? ' - ' : ''}{edu.endDate}</span>
                        </div>
                        {edu.degree && <p className="text-xs italic text-gray-700">{edu.degree}</p>}
                    </div>
                ))}
            </section>
        ),
        projects: () => (
            <section className="mb-4">
                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Projects</SectionHeader>
                 {data.projects.map(proj => (
                    <div key={proj.id} className="mb-2">
                         <div className="flex items-baseline flex-wrap gap-2">
                            <h3 className="text-sm font-semibold">{proj.name}</h3>
                            {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className={`text-xs ${theme.text} hover:underline`}>[{proj.url}]</a>}
                        </div>
                        <p className="text-xs text-gray-800 leading-relaxed">{proj.description}</p>
                    </div>
                ))}
            </section>
        )
    };

    const order = normalizeSectionOrder(data.sectionOrder);

    return (
        <div className="p-8 font-serif text-[10pt] leading-snug h-full bg-white text-black animate-fade-in">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-wider">{data.name}</h1>
                {contactItems.length > 0 && (
                    <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-1 text-xs mt-2 text-gray-600">
                        {contactItems.map((item, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <span>&bull;</span>}
                                <span>{item}</span>
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </header>

            {order.map(sectionId => {
                const typedId = sectionId as SectionId;
                if (!shouldRenderSection(data, typedId)) return null;
                const renderFn = sectionMap[typedId];
                return renderFn ? <React.Fragment key={sectionId}>{renderFn()}</React.Fragment> : null;
            })}
        </div>
    );
};