import * as React from 'react';
import type { ResumeData } from '../../types';
import { getThemeClasses } from '../../lib/colors';
import {
    cleanBulletLine,
    getHeadingCaseClass,
    getVisibleContactItems,
    normalizeSectionOrder,
    shouldRenderSection,
} from '../../lib/resumeUtils';

const SectionHeader: React.FC<{ children: React.ReactNode; className?: string; headingCaseClass: string }> = ({ children, className, headingCaseClass }) => (
    <h2 className={`text-sm font-bold ${headingCaseClass} tracking-widest border-b-2 pb-1 mb-3 ${className}`}>
        {children}
    </h2>
);

export const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);
    const headingCaseClass = getHeadingCaseClass(data.headingCase);
    const contactItems = getVisibleContactItems(data);

    const showExperience = shouldRenderSection(data, 'experience');
    const showProjects = shouldRenderSection(data, 'projects');
    const showSkills = shouldRenderSection(data, 'skills');
    const showEducation = shouldRenderSection(data, 'education');
    const hasLeftCol = showExperience || showProjects;
    const hasRightCol = showSkills || showEducation;

    const sectionOrder = normalizeSectionOrder(data.sectionOrder);
    const leftSections = sectionOrder.filter((id) => id === 'experience' || id === 'projects');
    const rightSections = sectionOrder.filter((id) => id === 'skills' || id === 'education');

    const getInitials = (name: string) => {
        const names = (name || '').trim().split(/\s+/).filter(Boolean);
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return (names[0] || 'YN').substring(0, 2).toUpperCase();
    };

    return (
        <div className="p-8 font-sans text-[10pt] leading-normal h-full bg-white text-black">
            <header className="flex items-center mb-8">
                <div className={`flex-shrink-0 h-20 w-20 rounded-full ${theme.bg} flex items-center justify-center text-white text-3xl font-bold`}>
                    {getInitials(data.name)}
                </div>
                <div className="ml-6">
                    <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
                    {contactItems.length > 0 && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mt-1 text-gray-600">
                            {contactItems.map((item, idx) => (
                                <React.Fragment key={idx}>
                                    {idx > 0 && <span>|</span>}
                                    <span>{item}</span>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {shouldRenderSection(data, 'summary') && (
                <section className="mb-6">
                    <p className="text-xs text-gray-800 italic text-center border-t border-b border-gray-200 py-3">{data.summary}</p>
                </section>
            )}
            
            {(hasLeftCol || hasRightCol) && (
                <div className={hasLeftCol && hasRightCol ? 'grid grid-cols-3 gap-8' : 'space-y-6'}>
                    {hasLeftCol && (
                        <div className={hasRightCol ? 'col-span-2 space-y-6' : 'space-y-6'}>
                            {leftSections.map((id) => {
                                if (id === 'experience' && showExperience) {
                                    return (
                                        <section key="experience">
                                            <SectionHeader headingCaseClass={headingCaseClass} className={`${theme.text} ${theme.border}`}>Experience</SectionHeader>
                                            {data.experience.map(exp => (
                                                <div key={exp.id} className="mb-4 last:mb-0">
                                                    <div className="flex justify-between items-baseline flex-wrap gap-2">
                                                        <h3 className="text-sm font-semibold">{exp.title}{exp.company ? <> at <span className="italic">{exp.company}</span></> : null}</h3>
                                                        <span className="text-xs font-light text-gray-600">{exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate}</span>
                                                    </div>
                                                    <ul className="list-disc list-inside mt-1 text-xs text-gray-800 space-y-1">
                                                        {exp.description.split('\n').map(cleanBulletLine).filter(Boolean).map((line, i) => <li key={i}>{line}</li>)}
                                                    </ul>
                                                </div>
                                            ))}
                                        </section>
                                    );
                                }
                                if (id === 'projects' && showProjects) {
                                    return (
                                        <section key="projects">
                                            <SectionHeader headingCaseClass={headingCaseClass} className={`${theme.text} ${theme.border}`}>Projects</SectionHeader>
                                            {data.projects.map(proj => (
                                                <div key={proj.id} className="mb-3 last:mb-0">
                                                    <div className="flex items-baseline flex-wrap gap-2">
                                                        <h3 className="text-sm font-semibold">{proj.name}</h3>
                                                        {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className={`text-xs ${theme.text} hover:underline`}>[{proj.url}]</a>}
                                                    </div>
                                                    <p className="text-xs text-gray-800 leading-relaxed">{proj.description}</p>
                                                </div>
                                            ))}
                                        </section>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}
                    {hasRightCol && (
                        <div className={hasLeftCol ? 'col-span-1 space-y-6' : 'space-y-6'}>
                            {rightSections.map((id) => {
                                if (id === 'skills' && showSkills) {
                                    return (
                                        <section key="skills">
                                            <SectionHeader headingCaseClass={headingCaseClass} className={`${theme.text} ${theme.border}`}>Skills</SectionHeader>
                                            <p className="text-xs text-gray-800 leading-relaxed">{data.skills}</p>
                                        </section>
                                    );
                                }
                                if (id === 'education' && showEducation) {
                                    return (
                                        <section key="education">
                                            <SectionHeader headingCaseClass={headingCaseClass} className={`${theme.text} ${theme.border}`}>Education</SectionHeader>
                                            {data.education.map(edu => (
                                                <div key={edu.id} className="mb-3 last:mb-0 text-xs">
                                                    <h3 className="font-semibold">{edu.degree}</h3>
                                                    <p className="italic text-gray-700">{edu.university}</p>
                                                    <span className="font-light text-gray-600">{edu.startDate}{edu.startDate && edu.endDate ? ' - ' : ''}{edu.endDate}</span>
                                                </div>
                                            ))}
                                        </section>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};