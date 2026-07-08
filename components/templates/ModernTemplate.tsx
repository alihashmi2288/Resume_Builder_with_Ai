import * as React from 'react';
import type { ResumeData } from '../../types';
import { Mail, Phone, Globe } from 'lucide-react';
import { getThemeClasses } from '../../lib/colors';

export const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);

    return (
        <div className="flex font-sans text-[10pt] h-full bg-white text-black">
            {/* Left Column */}
            <div className={`w-1/3 ${theme.bg} text-white p-6 flex flex-col gap-6`}>
                <div>
                    <h1 className="text-3xl font-bold tracking-wider leading-tight mb-2">{data.name}</h1>
                </div>
                
                <div className="space-y-3 text-xs">
                    <h2 className="font-bold uppercase tracking-widest border-b border-white/50 pb-1 mb-2">Contact</h2>
                    <div className="flex items-center gap-2"><Mail className="h-3 w-3 flex-shrink-0" /><span className="truncate">{data.email}</span></div>
                    <div className="flex items-center gap-2"><Phone className="h-3 w-3 flex-shrink-0" /><span>{data.phone}</span></div>
                    <div className="flex items-center gap-2"><Globe className="h-3 w-3 flex-shrink-0" /><span className="truncate">{data.website}</span></div>
                </div>

                <div className="space-y-2 text-xs">
                    <h2 className="font-bold uppercase tracking-widest border-b border-white/50 pb-1 mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-1.5 text-white/90">
                        {data.skills.split(',').map((skill, index) => (
                            <span key={index} className="bg-white/15 px-2 py-0.5 rounded text-[9px]">{skill.trim()}</span>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 text-xs">
                    <h2 className="font-bold uppercase tracking-widest border-b border-white/50 pb-1 mb-2">Education</h2>
                    {data.education.map(edu => (
                        <div key={edu.id} className="space-y-0.5">
                            <h3 className="font-semibold">{edu.degree}</h3>
                            <p className="opacity-90">{edu.university}</p>
                            <p className="opacity-75 text-[10px]">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column */}
            <div className="w-2/3 p-6 text-gray-800 flex flex-col gap-6">
                 <section>
                    <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.text} border-b-2 ${theme.border} pb-1 mb-3`}>Summary</h2>
                    <p className="text-xs leading-relaxed">{data.summary}</p>
                </section>
                
                <section>
                    <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.text} border-b-2 ${theme.border} pb-1 mb-3`}>Experience</h2>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="mb-4 last:mb-0">
                            <div className="flex justify-between items-baseline flex-wrap gap-2">
                                <h3 className="text-sm font-semibold text-gray-900">{exp.title}</h3>
                                <span className="text-xs font-light text-gray-500">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="text-xs italic text-gray-600 mb-1">{exp.company}</p>
                            <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-1">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                
                <section>
                    <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.text} border-b-2 ${theme.border} pb-1 mb-3`}>Projects</h2>
                     {data.projects.map(proj => (
                        <div key={proj.id} className="mb-3 last:mb-0">
                             <div className="flex items-baseline flex-wrap gap-2">
                                <h3 className="text-sm font-semibold text-gray-900">{proj.name}</h3>
                                {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className={`text-xs ${theme.text} hover:underline`}>[{proj.url}]</a>}
                            </div>
                            <p className="text-xs leading-relaxed text-gray-700">{proj.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};