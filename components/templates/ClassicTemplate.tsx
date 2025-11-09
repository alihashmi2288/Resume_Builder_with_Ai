import * as React from 'react';
import type { ResumeData } from '../../types';
import { Mail, Phone, Globe, Linkedin, Github } from 'lucide-react';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">
        {children}
    </h2>
);

export const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    return (
        <div className="p-8 font-serif text-[10pt] leading-snug h-full">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-wider">{data.name}</h1>
                <div className="flex justify-center items-center space-x-4 text-xs mt-2 text-gray-600">
                    <span>{data.email}</span>
                    <span>&bull;</span>
                    <span>{data.phone}</span>
                     <span>&bull;</span>
                    <span>{data.website}</span>
                </div>
            </header>

            <section className="mb-4">
                <SectionHeader>Summary</SectionHeader>
                <p className="text-xs text-gray-800">{data.summary}</p>
            </section>
            
            <section className="mb-4">
                <SectionHeader>Skills</SectionHeader>
                <p className="text-xs text-gray-800">{data.skills}</p>
            </section>

            <section className="mb-4">
                <SectionHeader>Experience</SectionHeader>
                {data.experience.map(exp => (
                    <div key={exp.id} className="mb-3">
                        <div className="flex justify-between items-baseline">
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

            <section className="mb-4">
                <SectionHeader>Education</SectionHeader>
                {data.education.map(edu => (
                    <div key={edu.id} className="mb-2">
                         <div className="flex justify-between items-baseline">
                            <h3 className="text-sm font-semibold">{edu.university}</h3>
                            <span className="text-xs font-light text-gray-600">{edu.startDate} - {edu.endDate}</span>
                        </div>
                        <p className="text-xs italic text-gray-700">{edu.degree}</p>
                    </div>
                ))}
            </section>
            
            <section>
                <SectionHeader>Projects</SectionHeader>
                 {data.projects.map(proj => (
                    <div key={proj.id} className="mb-2">
                         <div className="flex items-baseline">
                            <h3 className="text-sm font-semibold">{proj.name}</h3>
                            {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 ml-2 hover:underline">[{proj.url}]</a>}
                        </div>
                        <p className="text-xs text-gray-800">{proj.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};