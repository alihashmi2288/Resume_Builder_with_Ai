import * as React from 'react';
import type { ResumeData } from '../../types';

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
        {children}
    </h2>
);

export const TechnicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    return (
        <div className="p-8 font-sans text-[10pt] leading-normal bg-white h-full">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@400;700&display=swap');
                .font-roboto { font-family: 'Roboto', sans-serif; }
                .font-roboto-mono { font-family: 'Roboto Mono', monospace; }
            `}</style>
            <div className="font-roboto">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold">{data.name}</h1>
                    <div className="flex items-center space-x-3 text-xs mt-1 text-gray-600">
                        <a href={`mailto:${data.email}`} className="hover:text-blue-600">{data.email}</a>
                        <span>&bull;</span>
                        <span>{data.phone}</span>
                        <span>&bull;</span>
                        <a href={`https://${data.website}`} className="hover:text-blue-600">{data.website}</a>
                    </div>
                </header>

                <section className="mb-6">
                    <p className="text-xs text-gray-700">{data.summary}</p>
                </section>
                
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <section className="mb-6">
                            <SectionHeader>Experience</SectionHeader>
                            {data.experience.map(exp => (
                                <div key={exp.id} className="mb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-bold">{exp.title}</h3>
                                            <p className="text-xs text-gray-700">{exp.company}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <ul className="mt-1 text-xs text-gray-600 list-disc list-outside ml-4 space-y-1">
                                        {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    </div>
                    <div className="col-span-1">
                        <section className="mb-6">
                            <SectionHeader>Skills</SectionHeader>
                            <div className="flex flex-wrap gap-1">
                                {data.skills.split(',').map(skill => (
                                    <span key={skill} className="bg-gray-200 text-gray-800 text-[9pt] px-2 py-1 rounded font-roboto-mono">{skill.trim()}</span>
                                ))}
                            </div>
                        </section>
                        <section className="mb-6">
                            <SectionHeader>Projects</SectionHeader>
                            {data.projects.map(proj => (
                                <div key={proj.id} className="mb-3">
                                    <h3 className="text-sm font-bold">{proj.name}</h3>
                                    <p className="text-xs text-gray-600 mb-1">{proj.description}</p>
                                    {proj.url && <a href={proj.url} className="text-xs text-blue-600 hover:underline">View Project</a>}
                                </div>
                            ))}
                        </section>
                        <section>
                            <SectionHeader>Education</SectionHeader>
                            {data.education.map(edu => (
                                <div key={edu.id} className="mb-2">
                                    <h3 className="text-sm font-bold">{edu.degree}</h3>
                                    <p className="text-xs text-gray-700">{edu.university}</p>
                                    <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};