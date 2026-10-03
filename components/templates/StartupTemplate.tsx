import * as React from 'react';
import type { ResumeData } from '../../types';
import { getThemeClasses } from '../../lib/colors';

const SectionHeader: React.FC<{ children: React.ReactNode; theme: any }> = ({ children, theme }) => (
    <h2 className={`text-sm font-bold uppercase tracking-wider ${theme.text} mb-3`}>
        {children}
    </h2>
);

export const StartupTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);

    return (
        <div className="p-8 font-sans text-[10pt] leading-normal bg-white h-full text-black">
            <header className="relative pb-4 mb-6 bg-white text-black">
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.bg}`} />
                <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
                    <div>
                         <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">{data.name}</h1>
                         <p className="text-base text-gray-600 mt-1">{data.experience[0]?.title || 'Creative Professional'}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                        <p>{data.email}</p>
                        <p>{data.phone}</p>
                        <p>{data.website}</p>
                    </div>
                </div>
            </header>
            
            <section className="mb-6">
                <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
            </section>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8">
                    <section className="mb-6">
                        <SectionHeader theme={theme}>Experience</SectionHeader>
                        {data.experience.map(exp => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                    <div>
                                         <h3 className="text-sm font-semibold text-gray-900">{exp.title}</h3>
                                         <p className="text-xs text-gray-600">{exp.company}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <ul className="mt-1 text-xs text-gray-700 list-disc list-outside ml-4 space-y-1">
                                    {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                    
                    <section>
                        <SectionHeader theme={theme}>Projects</SectionHeader>
                        <div className="space-y-3">
                        {data.projects.map(proj => (
                            <div key={proj.id} className="">
                                <div className="flex items-baseline flex-wrap gap-2">
                                    <h3 className="text-sm font-semibold text-gray-900">{proj.name}</h3>
                                    {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} className={`text-xs ${theme.text} hover:underline`}>[{proj.url}]</a>}
                                </div>
                                <p className="text-xs text-gray-700 leading-relaxed mt-1">{proj.description}</p>
                            </div>
                        ))}
                        </div>
                    </section>
                </div>
                <div className="col-span-4">
                      <section className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <SectionHeader theme={theme}>Skills</SectionHeader>
                        <p className="text-xs text-gray-700 leading-relaxed">{data.skills}</p>
                    </section>
                    
                    <section className="bg-gray-50 p-4 rounded-lg">
                        <SectionHeader theme={theme}>Education</SectionHeader>
                        {data.education.map(edu => (
                            <div key={edu.id} className="mb-2 text-xs">
                                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                <p className="text-gray-600">{edu.university}</p>
                                <p className="text-gray-500">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};