import * as React from 'react';
import type { ResumeData } from '../../types';
import { getThemeClasses } from '../../lib/colors';

const SectionHeader: React.FC<{ children: React.ReactNode; theme: any }> = ({ children, theme }) => (
    <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.text} border-b-2 ${theme.borderLight} pb-1 mb-3`}>
        {children}
    </h2>
);

export const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);

    const sectionMap: Record<string, () => React.ReactNode> = {
        summary: () => (
            <section className="mb-4">
                <SectionHeader theme={theme}>Summary</SectionHeader>
                <p className="text-xs text-gray-800 leading-relaxed">{data.summary}</p>
            </section>
        ),
        skills: () => (
            <section className="mb-4">
                <SectionHeader theme={theme}>Skills</SectionHeader>
                <p className="text-xs text-gray-800 leading-relaxed">{data.skills}</p>
            </section>
        ),
        experience: () => (
            <section className="mb-4">
                <SectionHeader theme={theme}>Experience</SectionHeader>
                {data.experience.map(exp => (
                    <div key={exp.id} className="mb-3">
                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3 className="text-sm font-semibold">{exp.title}</h3>
                            <span className="text-xs font-light text-gray-600">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-xs italic text-gray-700">{exp.company}</p>
                        <ul className="list-disc list-inside mt-1 text-xs text-gray-800 space-y-1">
                            {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                        </ul>
                    </div>
                ))}
            </section>
        ),
        education: () => (
            <section className="mb-4">
                <SectionHeader theme={theme}>Education</SectionHeader>
                {data.education.map(edu => (
                    <div key={edu.id} className="mb-2">
                         <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3 className="text-sm font-semibold">{edu.university}</h3>
                            <span className="text-xs font-light text-gray-600">{edu.startDate} - {edu.endDate}</span>
                        </div>
                        <p className="text-xs italic text-gray-700">{edu.degree}</p>
                    </div>
                ))}
            </section>
        ),
        projects: () => (
            <section className="mb-4">
                <SectionHeader theme={theme}>Projects</SectionHeader>
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

    const order = data.sectionOrder || ['summary', 'skills', 'experience', 'education', 'projects'];

    return (
        <div className="p-8 font-serif text-[10pt] leading-snug h-full bg-white text-black animate-fade-in">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-wider">{data.name}</h1>
                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-xs mt-2 text-gray-600">
                    <span>{data.email}</span>
                    <span>&bull;</span>
                    <span>{data.phone}</span>
                    <span>&bull;</span>
                    <span>{data.website}</span>
                </div>
            </header>

            {order.map(sectionId => {
                const renderFn = sectionMap[sectionId];
                return renderFn ? <React.Fragment key={sectionId}>{renderFn()}</React.Fragment> : null;
            })}
        </div>
    );
};