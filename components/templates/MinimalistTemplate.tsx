import * as React from 'react';
import type { ResumeData } from '../../types';
import { getThemeClasses } from '../../lib/colors';

export const MinimalistTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);

    const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <h2 className={`text-xs font-semibold uppercase tracking-[.2em] ${theme.text} mb-4 mt-6 first:mt-0`}>
            {children}
        </h2>
    );

    return (
        <div className="p-12 font-light font-sans text-[10pt] leading-relaxed bg-white text-gray-800 h-full">
            <header className="text-center mb-10 bg-white text-black">
                <h1 className="text-4xl font-normal tracking-widest leading-tight">{data.name.toUpperCase()}</h1>
                <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-1 text-xs mt-2 text-gray-500 tracking-wider">
                    <span>{data.email}</span>
                    <span>/</span>
                    <span>{data.phone}</span>
                    <span>/</span>
                    <span>{data.website}</span>
                </div>
            </header>

            <hr className="border-gray-200" />

            <section className="mb-4">
                <SectionHeader>Profile</SectionHeader>
                <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
            </section>

            <section className="mb-4">
                <SectionHeader>Experience</SectionHeader>
                {data.experience.map(exp => (
                    <div key={exp.id} className="mb-5 last:mb-0 grid grid-cols-4 gap-4">
                        <div className="col-span-1 text-xs text-gray-600">
                            <p className="font-semibold text-gray-900">{exp.company}</p>
                            <p className="text-[10px] mt-0.5">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <div className="col-span-3">
                            <h3 className="text-sm font-semibold text-gray-900">{exp.title}</h3>
                            <ul className="list-disc list-outside ml-4 mt-1 text-xs text-gray-700 space-y-1">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    </div>
                ))}
            </section>
            
            <section className="mb-4">
                <SectionHeader>Skills</SectionHeader>
                <p className="text-xs text-gray-700 leading-relaxed">{data.skills}</p>
            </section>

            <div className="grid grid-cols-2 gap-8 mt-6">
                <section>
                    <SectionHeader>Education</SectionHeader>
                    {data.education.map(edu => (
                        <div key={edu.id} className="mb-3 last:mb-0 text-xs">
                             <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                             <div className="flex flex-col gap-0.5 mt-1">
                                <p className="text-gray-700">{edu.university}</p>
                                <span className="text-gray-500 text-[10px]">{edu.startDate} - {edu.endDate}</span>
                            </div>
                        </div>
                    ))}
                </section>
                
                <section>
                    <SectionHeader>Projects</SectionHeader>
                     {data.projects.map(proj => (
                        <div key={proj.id} className="mb-3 last:mb-0 text-xs">
                            <div className="flex items-baseline flex-wrap gap-2">
                                <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className={`text-xs ${theme.text} hover:underline`}>View Project</a>}
                            </div>
                            <p className="text-gray-700 leading-relaxed mt-1">{proj.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};