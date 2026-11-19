import * as React from 'react';
import type { ResumeData } from '../../types';
import { getThemeClasses } from '../../lib/colors';
import {
    cleanBulletLine,
    getHeadingCaseClass,
    normalizeSectionOrder,
    shouldRenderSection,
} from '../../lib/resumeUtils';

const SectionHeader: React.FC<{ children: React.ReactNode; theme: any; headingCaseClass: string }> = ({ children, theme, headingCaseClass }) => (
    <h2 className={`text-sm font-bold ${headingCaseClass} tracking-wider ${theme.text} mb-3`}>
        {children}
    </h2>
);

export const StartupTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);
    const headingCaseClass = getHeadingCaseClass(data.headingCase);

    const showExperience = shouldRenderSection(data, 'experience');
    const showProjects = shouldRenderSection(data, 'projects');
    const showSkills = shouldRenderSection(data, 'skills');
    const showEducation = shouldRenderSection(data, 'education');
    const hasLeftCol = showExperience || showProjects;
    const hasRightCol = showSkills || showEducation;

    const sectionOrder = normalizeSectionOrder(data.sectionOrder);
    const leftSections = sectionOrder.filter((id) => id === 'experience' || id === 'projects');
    const rightSections = sectionOrder.filter((id) => id === 'skills' || id === 'education');

    return (
        <div className="p-8 font-sans text-[10pt] leading-normal bg-white h-full text-black">
            <header className="relative pb-4 mb-6 bg-white text-black">
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.bg}`} />
                <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
                    <div>
                         <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">{data.name}</h1>
                         {showExperience && data.experience[0]?.title && (
                             <p className="text-base text-gray-600 mt-1">{data.experience[0].title}</p>
                         )}
                    </div>
                    <div className="text-right text-xs text-gray-500">
                        {data.email?.trim() && <p>{data.email}</p>}
                        {data.phone?.trim() && <p>{data.phone}</p>}
                        {data.website?.trim() && <p>{data.website}</p>}
                    </div>
                </div>
            </header>
            
            {shouldRenderSection(data, 'summary') && (
                <section className="mb-6">
                    <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
                </section>
            )}

            {(hasLeftCol || hasRightCol) && (
                <div className={hasLeftCol && hasRightCol ? 'grid grid-cols-12 gap-8' : 'space-y-6'}>
                    {hasLeftCol && (
                        <div className={hasRightCol ? 'col-span-8 space-y-6' : 'space-y-6'}>
                            {leftSections.map((id) => {
                                if (id === 'experience' && showExperience) {
                                    return (
                                        <section key="experience">
                                            <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Experience</SectionHeader>
                                            {data.experience.map(exp => (
                                                <div key={exp.id} className="mb-4 last:mb-0">
                                                    <div className="flex justify-between items-start flex-wrap gap-2">
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-gray-900">{exp.title}</h3>
                                                            {exp.company && <p className="text-xs text-gray-600">{exp.company}</p>}
                                                        </div>
                                                        <span className="text-xs text-gray-500 whitespace-nowrap">{exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate}</span>
                                                    </div>
                                                    <ul className="mt-1 text-xs text-gray-700 list-disc list-outside ml-4 space-y-1">
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
                                            <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Projects</SectionHeader>
                                            <div className="space-y-3">
                                                {data.projects.map(proj => (
                                                    <div key={proj.id}>
                                                        <div className="flex items-baseline flex-wrap gap-2">
                                                            <h3 className="text-sm font-semibold text-gray-900">{proj.name}</h3>
                                                            {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} className={`text-xs ${theme.text} hover:underline`}>[{proj.url}]</a>}
                                                        </div>
                                                        <p className="text-xs text-gray-700 leading-relaxed mt-1">{proj.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}
                    {hasRightCol && (
                        <div className={hasLeftCol ? 'col-span-4 space-y-6' : 'space-y-6'}>
                            {rightSections.map((id) => {
                                if (id === 'skills' && showSkills) {
                                    return (
                                        <section key="skills" className="bg-gray-50 p-4 rounded-lg">
                                            <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Skills</SectionHeader>
                                            <p className="text-xs text-gray-700 leading-relaxed">{data.skills}</p>
                                        </section>
                                    );
                                }
                                if (id === 'education' && showEducation) {
                                    return (
                                        <section key="education" className="bg-gray-50 p-4 rounded-lg">
                                            <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Education</SectionHeader>
                                            {data.education.map(edu => (
                                                <div key={edu.id} className="mb-2 last:mb-0 text-xs">
                                                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                                    <p className="text-gray-600">{edu.university}</p>
                                                    {(edu.startDate || edu.endDate) && (
                                                        <p className="text-gray-500">{edu.startDate}{edu.startDate && edu.endDate ? ' - ' : ''}{edu.endDate}</p>
                                                    )}
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