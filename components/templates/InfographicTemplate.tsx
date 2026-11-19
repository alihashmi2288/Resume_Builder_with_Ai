import * as React from 'react';
import type { ResumeData } from '../../types';
import { Mail, Phone, Globe, Star, GraduationCap, Lightbulb } from 'lucide-react';
import { getThemeClasses } from '../../lib/colors';
import {
    cleanBulletLine,
    getHeadingCaseClass,
    getSkillList,
    normalizeSectionOrder,
    shouldRenderSection,
} from '../../lib/resumeUtils';

const SidebarSection: React.FC<{ title: string; icon: React.ElementType; headingCaseClass: string; children: React.ReactNode }> = ({ title, icon: Icon, headingCaseClass, children }) => (
    <div className="mb-6">
        <h2 className={`text-xs font-bold ${headingCaseClass} tracking-widest text-white/90 mb-2 flex items-center`}>
            <Icon className="h-4 w-4 mr-2" />
            {title}
        </h2>
        <div className="text-xs text-white/80 space-y-2">{children}</div>
    </div>
);

export const InfographicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);
    const headingCaseClass = getHeadingCaseClass(data.headingCase);
    const skills = getSkillList(data.skills);
    const hasContact = Boolean(data.email?.trim() || data.phone?.trim() || data.website?.trim());
    const mainOrder = normalizeSectionOrder(data.sectionOrder).filter(
        (id): id is 'summary' | 'experience' | 'projects' => id === 'summary' || id === 'experience' || id === 'projects'
    );
    const sidebarOrder = normalizeSectionOrder(data.sectionOrder).filter(
        (id): id is 'skills' | 'education' => id === 'skills' || id === 'education'
    );
    const initial = (data.name || '').trim().charAt(0).toUpperCase() || 'R';

    return (
        <div className="flex font-sans text-[10pt] h-full bg-white text-black">
            {/* Sidebar */}
            <div className={`w-[35%] ${theme.bg} text-white p-6 flex flex-col gap-6`}>
                <div className="text-center mb-4">
                     <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{initial}</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-wide leading-tight truncate">{data.name}</h1>
                    {shouldRenderSection(data, 'experience') && data.experience[0]?.title && (
                        <p className="text-xs text-white/80 mt-1 truncate">{data.experience[0].title}</p>
                    )}
                </div>

                {hasContact && (
                    <SidebarSection title="Contact" icon={Star} headingCaseClass={headingCaseClass}>
                        {data.email?.trim() && <p className="flex items-start gap-1.5"><Mail className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /><span className="truncate">{data.email}</span></p>}
                        {data.phone?.trim() && <p className="flex items-start gap-1.5"><Phone className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /><span>{data.phone}</span></p>}
                        {data.website?.trim() && <p className="flex items-start gap-1.5"><Globe className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /><span className="truncate">{data.website}</span></p>}
                    </SidebarSection>
                )}

                {sidebarOrder.map((sectionId) => {
                    if (!shouldRenderSection(data, sectionId)) return null;
                    if (sectionId === 'skills') {
                        return (
                            <SidebarSection key="skills" title="Skills" icon={Lightbulb} headingCaseClass={headingCaseClass}>
                                <div className="flex flex-wrap gap-1">
                                    {skills.map((skill, i) => (
                                        <span key={i} className="bg-white/15 px-2 py-0.5 rounded text-[9px]">{skill}</span>
                                    ))}
                                </div>
                            </SidebarSection>
                        );
                    }
                    if (sectionId === 'education') {
                        return (
                            <SidebarSection key="education" title="Education" icon={GraduationCap} headingCaseClass={headingCaseClass}>
                                {data.education.map(edu => (
                                    <div key={edu.id} className="mb-2 last:mb-0">
                                        <h3 className="font-semibold text-white/95">{edu.degree}</h3>
                                        <p className="opacity-90">{edu.university}</p>
                                        {(edu.startDate || edu.endDate) && (
                                            <p className="opacity-60 text-[9px]">{edu.startDate}{edu.startDate && edu.endDate ? ' - ' : ''}{edu.endDate}</p>
                                        )}
                                    </div>
                                ))}
                            </SidebarSection>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Main Content */}
            <div className="w-[65%] p-8 text-gray-800 flex flex-col gap-6">
                {mainOrder.map((sectionId) => {
                    if (!shouldRenderSection(data, sectionId)) return null;
                    if (sectionId === 'summary') {
                        return (
                            <section key="summary">
                                <h2 className={`text-sm font-bold ${headingCaseClass} tracking-widest ${theme.text} border-b-2 ${theme.borderLight} pb-1 mb-3`}>Summary</h2>
                                <p className="text-xs leading-relaxed text-gray-700">{data.summary}</p>
                            </section>
                        );
                    }
                    if (sectionId === 'experience') {
                        return (
                            <section key="experience">
                                <h2 className={`text-sm font-bold ${headingCaseClass} tracking-widest ${theme.text} border-b-2 ${theme.borderLight} pb-1 mb-3`}>Experience</h2>
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="mb-4 last:mb-0">
                                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                                            <h3 className="text-sm font-semibold text-gray-950">{exp.title}</h3>
                                            <span className="text-xs font-light text-gray-500">{exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate}</span>
                                        </div>
                                        {exp.company && <p className={`text-xs italic ${theme.text} font-medium mb-1`}>{exp.company}</p>}
                                        <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-1">
                                            {exp.description.split('\n').map(cleanBulletLine).filter(Boolean).map((line, i) => <li key={i}>{line}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </section>
                        );
                    }
                    if (sectionId === 'projects') {
                        return (
                            <section key="projects">
                                <h2 className={`text-sm font-bold ${headingCaseClass} tracking-widest ${theme.text} border-b-2 ${theme.borderLight} pb-1 mb-3`}>Projects</h2>
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
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};