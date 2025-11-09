import * as React from 'react';
import type { ResumeData } from '../../types';
import { Mail, Phone, Globe } from 'lucide-react';

export const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const accentColor = 'bg-slate-700';
    const accentText = 'text-slate-700';

    return (
        <div className="flex font-sans text-[10pt] h-full">
            {/* Left Column */}
            <div className={`w-1/3 ${accentColor} text-white p-6`}>
                <h1 className="text-3xl font-bold tracking-wider mb-4">{data.name}</h1>
                
                <div className="space-y-4 text-xs">
                    <h2 className="font-bold uppercase tracking-widest border-b border-white/50 pb-1 mb-2">Contact</h2>
                    <div className="flex items-center"><Mail className="h-3 w-3 mr-2" /><span>{data.email}</span></div>
                    <div className="flex items-center"><Phone className="h-3 w-3 mr-2" /><span>{data.phone}</span></div>
                    <div className="flex items-center"><Globe className="h-3 w-3 mr-2" /><span>{data.website}</span></div>
                </div>

                <div className="mt-6 space-y-2 text-xs">
                    <h2 className="font-bold uppercase tracking-widest border-b border-white/50 pb-1 mb-2">Skills</h2>
                    <p>{data.skills}</p>
                </div>

                <div className="mt-6 space-y-3 text-xs">
                    <h2 className="font-bold uppercase tracking-widest border-b border-white/50 pb-1 mb-2">Education</h2>
                    {data.education.map(edu => (
                        <div key={edu.id}>
                            <h3 className="font-semibold">{edu.degree}</h3>
                            <p className="opacity-80">{edu.university}</p>
                            <p className="opacity-60">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column */}
            <div className="w-2/3 p-6 text-gray-800">
                 <section className="mb-6">
                    <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} border-b-2 border-slate-700 pb-1 mb-3`}>Summary</h2>
                    <p className="text-xs">{data.summary}</p>
                </section>
                
                <section className="mb-6">
                    <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} border-b-2 border-slate-700 pb-1 mb-3`}>Experience</h2>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="mb-4">
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
                
                <section>
                    <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} border-b-2 border-slate-700 pb-1 mb-3`}>Projects</h2>
                     {data.projects.map(proj => (
                        <div key={proj.id} className="mb-3">
                             <div className="flex items-baseline">
                                <h3 className="text-sm font-semibold">{proj.name}</h3>
                                {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 ml-2 hover:underline">[{proj.url}]</a>}
                            </div>
                            <p className="text-xs">{proj.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};