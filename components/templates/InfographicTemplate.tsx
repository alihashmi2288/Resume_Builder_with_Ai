import * as React from 'react';
import type { ResumeData } from '../../types';
import { Mail, Phone, Globe, Star, Briefcase, GraduationCap, Lightbulb } from 'lucide-react';

const SidebarSection: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-2 flex items-center">
            <Icon className="h-4 w-4 mr-2" />
            {title}
        </h2>
        <div className="text-xs text-white/70 space-y-2">{children}</div>
    </div>
);

export const InfographicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    return (
        <div className="flex font-sans text-[10pt] h-full">
            {/* Sidebar */}
            <div className="w-[35%] bg-sky-800 text-white p-6">
                <div className="text-center mb-8">
                     <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">{data.name.charAt(0)}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-wide">{data.name}</h1>
                    <p className="text-sm text-white/80">{data.experience[0]?.title || 'Professional'}</p>
                </div>

                <SidebarSection title="Contact" icon={Star}>
                    <p className="flex items-start"><Mail className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" /><span>{data.email}</span></p>
                    <p className="flex items-start"><Phone className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" /><span>{data.phone}</span></p>
                    <p className="flex items-start"><Globe className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" /><span>{data.website}</span></p>
                </SidebarSection>
                
                <SidebarSection title="Skills" icon={Lightbulb}>
                    <ul className="list-disc list-inside">
                        {data.skills.split(',').map(skill => <li key={skill}>{skill.trim()}</li>)}
                    </ul>
                </SidebarSection>

                <SidebarSection title="Education" icon={GraduationCap}>
                    {data.education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <h3 className="font-semibold text-white/90">{edu.degree}</h3>
                            <p>{edu.university}</p>
                            <p className="text-white/60 text-[9pt]">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </SidebarSection>
            </div>

            {/* Main Content */}
            <div className="w-[65%] p-8 text-gray-800">
                <section className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-widest text-sky-800 border-b-2 border-sky-200 pb-1 mb-3">Summary</h2>
                    <p className="text-xs">{data.summary}</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-base font-bold uppercase tracking-widest text-sky-800 border-b-2 border-sky-200 pb-1 mb-3">Experience</h2>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-semibold">{exp.title}</h3>
                                <span className="text-xs font-light text-gray-600">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="text-xs italic text-sky-900">{exp.company}</p>
                            <ul className="list-disc list-inside mt-1 text-xs text-gray-700 space-y-1">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                
                <section>
                    <h2 className="text-base font-bold uppercase tracking-widest text-sky-800 border-b-2 border-sky-200 pb-1 mb-3">Projects</h2>
                     {data.projects.map(proj => (
                        <div key={proj.id} className="mb-3">
                             <div className="flex items-baseline">
                                <h3 className="text-sm font-semibold">{proj.name}</h3>
                                {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs text-sky-600 ml-2 hover:underline">[{proj.url}]</a>}
                            </div>
                            <p className="text-xs">{proj.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};