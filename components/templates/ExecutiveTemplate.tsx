import * as React from 'react';
import type { ResumeData } from '../../types';
import { getThemeClasses } from '../../lib/colors';

export const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);

    const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <h2 className={`text-sm font-semibold uppercase tracking-[.2em] ${theme.text} mt-6 mb-3 pb-1 border-b-2 ${theme.borderLight}`}>
            {children}
        </h2>
    );

    return (
        <div className="p-12 font-serif text-[11pt] leading-relaxed bg-white text-gray-800 h-full">
             <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap');
                .font-merriweather { font-family: 'Merriweather', serif; }
            `}</style>
            <div className="font-merriweather bg-white text-black">
                <header className={`text-center border-b-2 ${theme.border} pb-4 mb-6`}>
                    <h1 className="text-5xl font-bold tracking-wider">{data.name}</h1>
                    <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-1 text-xs mt-3 text-gray-600">
                        <span>{data.email}</span>
                        <span>&bull;</span>
                        <span>{data.phone}</span>
                        <span>&bull;</span>
                        <span>{data.website}</span>
                    </div>
                </header>

                <section>
                    <p className="text-xs text-center italic text-gray-800 leading-relaxed">{data.summary}</p>
                </section>

                <section>
                    <SectionHeader>Core Competencies</SectionHeader>
                    <p className="text-xs text-center text-gray-800 leading-relaxed">{data.skills}</p>
                </section>

                <section>
                    <SectionHeader>Professional Experience</SectionHeader>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="mb-5 last:mb-0">
                            <div className="flex justify-between items-baseline flex-wrap gap-2">
                                <h3 className="text-sm font-bold text-gray-900">{exp.title}</h3>
                                <span className="text-xs font-normal text-gray-500">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="text-xs italic text-gray-700 mb-1">{exp.company}</p>
                            <ul className="list-disc list-outside ml-5 text-xs text-gray-700 space-y-1">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-2 gap-x-12 mt-6">
                    <section>
                        <SectionHeader>Education</SectionHeader>
                        {data.education.map(edu => (
                            <div key={edu.id} className="mb-3 last:mb-0 text-xs">
                                <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                                <p className="italic text-gray-700">{edu.university}</p>
                                <p className="text-gray-500">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </section>
                    
                    <section>
                        <SectionHeader>Key Projects</SectionHeader>
                        {data.projects.map(proj => (
                            <div key={proj.id} className="mb-3 last:mb-0 text-xs">
                                <h3 className="text-sm font-bold text-gray-900">{proj.name}</h3>
                                <p className="text-gray-700 leading-relaxed">{proj.description}</p>
                                {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} className={`text-xs ${theme.text} hover:underline mt-1 inline-block`}>View Project</a>}
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};