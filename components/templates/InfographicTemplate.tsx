import * as React from 'react';
import type { ResumeData } from '../../types';
import { Mail, Phone, Globe, Star, GraduationCap, Lightbulb } from 'lucide-react';
import { getThemeClasses } from '../../lib/colors';

const SidebarSection: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-2 flex items-center">
            <Icon className="h-4 w-4 mr-2" />
            {title}
        </h2>
        <div className="text-xs text-white/80 space-y-2">{children}</div>
    </div>
);

export const InfographicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);

    return (
        <div className="flex font-sans text-[10pt] h-full bg-white text-black">
            {/* Sidebar */}
            <div className={`w-[35%] ${theme.bg} text-white p-6 flex flex-col gap-6`}>
                <div className="text-center mb-4">
                     <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{data.name.charAt(0)}</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-wide leading-tight truncate">{data.name}</h1>
                    <p className="text-xs text-white/80 mt-1 truncate">{data.experience[0]?.title || 'Professional'}</p>
                </div>

                <SidebarSection title="Contact" icon={Star}>
                    <p className="flex items-start gap-1.5"><Mail className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /><span className="truncate">{data.email}</span></p>
                    <p className="flex items-start gap-1.5"><Phone className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /><span>{data.phone}</span></p>
                    <p className="flex items-start gap-1.5"><Globe className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /><span className="truncate">{data.website}</span></p>
                </SidebarSection>
                
                <SidebarSection title="Skills" icon={Lightbulb}>
                    <div className="flex flex-wrap gap-1">
                        {data.skills.split(',').map((skill, i) => (
                            <span key={i} className="bg-white/15 px-2 py-0.5 rounded text-[9px]">{skill.trim()}</span>
                        ))}
                    </div>
                </SidebarSection>

                <SidebarSection title="Education" icon={GraduationCap}>
                    {data.education.map(edu => (
                        <div key={edu.id} className="mb-2 last:mb-0">
                            <h3 className="font-semibold text-white/95">{edu.degree}</h3>
                            <p className="opacity-90">{edu.university}</p>
                            <p className="opacity-60 text-[9px]">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </SidebarSection>
            </div>

            {/* Main Content */}
            <div className="w-[65%] p-8 text-gray-800 flex flex-col gap-6">
                <section>
                    <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.text} border-b-2 ${theme.borderLight} pb-1 mb-3`}>Summary</h2>
                    <p className="text-xs leading-relaxed text-gray-700">{data.summary}</p>
                </section>

                <section>
                    <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.text} border-b-2 ${theme.borderLight} pb-1 mb-3`}>Experience</h2>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="mb-4 last:mb-0">
                            <div className="flex justify-between items-baseline flex-wrap gap-2">
                                <h3 className="text-sm font-semibold text-gray-950">{exp.title}</h3>
                                <span className="text-xs font-light text-gray-500">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className={`text-xs italic ${theme.text} font-medium mb-1`}>{exp.company}</p>
                            <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-1">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                
                <section>
                    <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.text} border-b-2 ${theme.borderLight} pb-1 mb-3`}>Projects</h2>
                     {data.projects.map(proj => (
                        <div key={proj.id} className="mb-3 last:mb-0">
                             <div className="flex items-baseline flex-wrap gap-2">
                                <h3 className="text-sm font-semibold text-gray-950">{proj.name}</h3>
                                {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className={`text-xs ${theme.text} hover:underline`}>[{proj.url}]</a>}
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">{proj.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};