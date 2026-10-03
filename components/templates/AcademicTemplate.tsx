import * as React from 'react';
import type { ResumeData } from '../../types';
import { getThemeClasses } from '../../lib/colors';

const SectionHeader: React.FC<{ children: React.ReactNode; theme: any }> = ({ children, theme }) => (
    <h2 className={`text-base font-semibold tracking-wider border-b-2 ${theme.border} ${theme.text} pb-1 my-4`}>
        {children}
    </h2>
);

export const AcademicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);

    const sectionMap: Record<string, () => React.ReactNode> = {
        summary: () => (
            <section>
                <SectionHeader theme={theme}>Professional Summary</SectionHeader>
                <p className="text-xs leading-relaxed text-gray-800">{data.summary}</p>
            </section>
        ),
        skills: () => (
            <section>
                <SectionHeader theme={theme}>Skills</SectionHeader>
                <p className="text-xs leading-relaxed text-gray-800">{data.skills}</p>
            </section>
        ),
        experience: () => (
            <section>
                <SectionHeader theme={theme}>Professional Experience</SectionHeader>
                {data.experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3 className="text-sm font-semibold text-gray-900">{exp.title}, <span className="italic font-normal text-gray-700">{exp.company}</span></h3>
                            <span className="text-xs text-gray-500">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <ul className="list-disc list-outside ml-5 mt-1 text-xs text-gray-700 space-y-1">
                            {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                        </ul>
                    </div>
                ))}
            </section>
        ),
        education: () => (
            <section>
                <SectionHeader theme={theme}>Education</SectionHeader>
                {data.education.map(edu => (
                    <div key={edu.id} className="mb-3">
                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3 className="text-sm font-semibold text-gray-900">{edu.degree}</h3>
                            <span className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</span>
                        </div>
                        <p className="italic text-xs text-gray-700">{edu.university}</p>
                    </div>
                ))}
            </section>
        ),
        projects: () => (
            <section>
                <SectionHeader theme={theme}>Selected Projects</SectionHeader>
                {data.projects.map(proj => (
                    <div key={proj.id} className="mb-3">
                        <div className="flex items-baseline flex-wrap gap-2">
                            <h3 className="text-sm font-semibold text-gray-900">{proj.name}</h3>
                            {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className={`text-xs ${theme.text} hover:underline ml-3`}>{proj.url}</a>}
                        </div>
                        <p className="text-xs text-gray-800 leading-relaxed">{proj.description}</p>
                    </div>
                ))}
            </section>
        )
    };

    const order = data.sectionOrder || ['summary', 'skills', 'experience', 'education', 'projects'];

    return (
        <div className="p-10 font-serif text-[11pt] leading-relaxed text-gray-900 h-full bg-white text-black animate-fade-in">
            <div className="font-lora">
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold">{data.name}</h1>
                    <div className="text-sm mt-2 text-gray-600">
                        {data.email} | {data.phone} | {data.website}
                    </div>
                </header>

                {order.map(sectionId => {
                    const renderFn = sectionMap[sectionId];
                    return renderFn ? <React.Fragment key={sectionId}>{renderFn()}</React.Fragment> : null;
                })}
            </div>
        </div>
    );
};