import * as React from 'react';
import type { ResumeData } from '../../types';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-base font-semibold tracking-wider border-b border-black pb-1 my-4">
        {children}
    </h2>
);

export const AcademicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    return (
        <div className="p-10 font-serif text-[11pt] leading-relaxed text-gray-900 h-full bg-white">
             <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap');
                .font-lora { font-family: 'Lora', serif; }
            `}</style>
            <div className="font-lora">
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold">{data.name}</h1>
                    <div className="text-sm mt-2">
                        {data.email} | {data.phone} | {data.website}
                    </div>
                </header>

                <section>
                    <SectionHeader>Professional Summary</SectionHeader>
                    <p>{data.summary}</p>
                </section>
                
                <section>
                    <SectionHeader>Skills</SectionHeader>
                    <p>{data.skills}</p>
                </section>

                <section>
                    <SectionHeader>Professional Experience</SectionHeader>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-semibold">{exp.title}, <span className="italic font-normal">{exp.company}</span></h3>
                                <span className="text-sm text-gray-700">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <ul className="list-disc list-outside mt-1 ml-5 space-y-1">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                <section>
                    <SectionHeader>Education</SectionHeader>
                    {data.education.map(edu => (
                        <div key={edu.id} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                                <span className="text-sm text-gray-700">{edu.startDate} – {edu.endDate}</span>
                            </div>
                            <p className="italic">{edu.university}</p>
                        </div>
                    ))}
                </section>
                
                <section>
                    <SectionHeader>Selected Projects</SectionHeader>
                    {data.projects.map(proj => (
                        <div key={proj.id} className="mb-3">
                            <div className="flex items-baseline">
                                <h3 className="text-lg font-semibold">{proj.name}</h3>
                                {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-sm text-blue-700 ml-3 hover:underline">{proj.url}</a>}
                            </div>
                            <p>{proj.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};