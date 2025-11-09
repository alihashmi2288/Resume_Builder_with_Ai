import * as React from 'react';
import type { ResumeData } from '../../types';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xs font-normal uppercase tracking-[.2em] text-gray-500 mb-4 mt-6 first:mt-0">
        {children}
    </h2>
);

export const MinimalistTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    return (
        <div className="p-12 font-light font-sans text-[10pt] leading-relaxed text-gray-800 h-full">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-normal tracking-widest">{data.name.toUpperCase()}</h1>
                <div className="flex justify-center items-center space-x-3 text-xs mt-2 text-gray-500 tracking-wider">
                    <span>{data.email}</span>
                    <span>/</span>
                    <span>{data.phone}</span>
                     <span>/</span>
                    <span>{data.website}</span>
                </div>
            </header>

            <hr className="border-gray-200" />

            <section>
                <SectionHeader>Profile</SectionHeader>
                <p className="text-xs">{data.summary}</p>
            </section>

            <section>
                <SectionHeader>Experience</SectionHeader>
                {data.experience.map(exp => (
                    <div key={exp.id} className="mb-5 grid grid-cols-4 gap-4">
                        <div className="col-span-1 text-xs text-gray-600">
                            <p className="font-semibold">{exp.company}</p>
                            <p>{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <div className="col-span-3">
                            <h3 className="text-sm font-normal">{exp.title}</h3>
                            <ul className="list-disc list-outside ml-4 mt-1 text-xs text-gray-700 space-y-1">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    </div>
                ))}
            </section>
            
            <section>
                <SectionHeader>Skills</SectionHeader>
                <p className="text-xs">{data.skills}</p>
            </section>

            <div className="grid grid-cols-2 gap-8">
                <section>
                    <SectionHeader>Education</SectionHeader>
                    {data.education.map(edu => (
                        <div key={edu.id} className="mb-2 text-xs">
                             <h3 className="font-normal">{edu.degree}</h3>
                             <div className="flex justify-between">
                                <p className="text-gray-700">{edu.university}</p>
                                <span className="text-gray-600">{edu.startDate} - {edu.endDate}</span>
                            </div>
                        </div>
                    ))}
                </section>
                
                <section>
                    <SectionHeader>Projects</SectionHeader>
                     {data.projects.map(proj => (
                        <div key={proj.id} className="mb-2 text-xs">
                            <div className="flex items-baseline">
                                <h3 className="font-normal">{proj.name}</h3>
                                {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-blue-600 ml-2 hover:underline text-[9pt]">link</a>}
                            </div>
                            <p className="text-gray-700">{proj.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};