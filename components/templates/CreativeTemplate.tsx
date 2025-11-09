import * as React from 'react';
import type { ResumeData } from '../../types';

const SectionHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <h2 className={`text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3 ${className}`}>
        {children}
    </h2>
);

export const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const accentColor = 'text-teal-600';
    const accentBorder = 'border-teal-600';

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    return (
        <div className="p-8 font-sans text-[10pt] leading-normal h-full">
            <header className="flex items-center mb-8">
                <div className="flex-shrink-0 h-20 w-20 rounded-full bg-teal-600 flex items-center justify-center text-white text-3xl font-bold">
                    {getInitials(data.name)}
                </div>
                <div className="ml-6">
                    <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
                    <div className="flex items-center space-x-4 text-xs mt-1 text-gray-600">
                        <span>{data.email}</span>
                        <span>|</span>
                        <span>{data.phone}</span>
                         <span>|</span>
                        <span>{data.website}</span>
                    </div>
                </div>
            </header>

            <section className="mb-6">
                <p className="text-xs text-gray-800 italic text-center border-t border-b border-gray-200 py-3">{data.summary}</p>
            </section>
            
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2">
                     <section className="mb-6">
                        <SectionHeader className={`${accentColor} ${accentBorder}`}>Experience</SectionHeader>
                        {data.experience.map(exp => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-semibold">{exp.title} at <span className="italic">{exp.company}</span></h3>
                                    <span className="text-xs font-light text-gray-600">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <ul className="list-disc list-inside mt-1 text-xs text-gray-800 space-y-1">
                                    {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                     <section>
                        <SectionHeader className={`${accentColor} ${accentBorder}`}>Projects</SectionHeader>
                         {data.projects.map(proj => (
                            <div key={proj.id} className="mb-3">
                                 <div className="flex items-baseline">
                                    <h3 className="text-sm font-semibold">{proj.name}</h3>
                                    {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 ml-2 hover:underline">[{proj.url}]</a>}
                                </div>
                                <p className="text-xs text-gray-800">{proj.description}</p>
                            </div>
                        ))}
                    </section>
                </div>
                <div className="col-span-1">
                    <section className="mb-6">
                        <SectionHeader className={`${accentColor} ${accentBorder}`}>Skills</SectionHeader>
                        <p className="text-xs text-gray-800">{data.skills}</p>
                    </section>
                    
                     <section>
                        <SectionHeader className={`${accentColor} ${accentBorder}`}>Education</SectionHeader>
                        {data.education.map(edu => (
                            <div key={edu.id} className="mb-3 text-xs">
                                <h3 className="font-semibold">{edu.degree}</h3>
                                <p className="italic text-gray-700">{edu.university}</p>
                                <span className="font-light text-gray-600">{edu.startDate} - {edu.endDate}</span>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};