import * as React from 'react';
import type { ResumeData } from '../../types';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-sm font-semibold uppercase tracking-[.2em] text-gray-600 mt-6 mb-3 pb-1 border-b">
        {children}
    </h2>
);

export const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    return (
        <div className="p-12 font-serif text-[11pt] leading-relaxed bg-white text-gray-800 h-full">
             <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap');
                .font-merriweather { font-family: 'Merriweather', serif; }
            `}</style>
            <div className="font-merriweather">
                <header className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                    <h1 className="text-5xl font-bold tracking-wider">{data.name}</h1>
                    <div className="flex justify-center items-center space-x-3 text-xs mt-3 text-gray-600">
                        <span>{data.email}</span>
                        <span>&bull;</span>
                        <span>{data.phone}</span>
                        <span>&bull;</span>
                        <span>{data.website}</span>
                    </div>
                </header>

                <section>
                    <p className="text-sm text-center italic">{data.summary}</p>
                </section>

                <section>
                    <SectionHeader>Core Competencies</SectionHeader>
                    <p className="text-sm text-center">{data.skills}</p>
                </section>

                <section>
                    <SectionHeader>Professional Experience</SectionHeader>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="mb-5">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-base font-bold">{exp.title}</h3>
                                <span className="text-sm font-normal text-gray-600">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="text-sm italic text-gray-700 mb-1">{exp.company}</p>
                            <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-2 gap-x-12">
                    <section>
                        <SectionHeader>Education</SectionHeader>
                        {data.education.map(edu => (
                            <div key={edu.id} className="mb-2">
                                <h3 className="text-base font-bold">{edu.degree}</h3>
                                <p className="text-sm italic text-gray-700">{edu.university}</p>
                                <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </section>
                    
                    <section>
                        <SectionHeader>Key Projects</SectionHeader>
                        {data.projects.map(proj => (
                            <div key={proj.id} className="mb-2">
                                <h3 className="text-base font-bold">{proj.name}</h3>
                                <p className="text-sm">{proj.description}</p>
                                {proj.url && <a href={proj.url} className="text-sm text-blue-600 hover:underline">View Project</a>}
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};