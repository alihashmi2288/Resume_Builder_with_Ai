import * as React from 'react';
import type { ResumeData } from '../../types';
import { getThemeClasses } from '../../lib/colors';
import {
    cleanBulletLine,
    getHeadingCaseClass,
    getSkillList,
    normalizeSectionOrder,
    shouldRenderSection,
} from '../../lib/resumeUtils';

const SectionHeader: React.FC<{ children: React.ReactNode; theme: any; headingCaseClass: string }> = ({ children, theme, headingCaseClass }) => (
    <h2 className={`text-xs font-bold ${headingCaseClass} tracking-wider ${theme.text} mb-2`}>
        {children}
    </h2>
);

export const TechnicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);
    const headingCaseClass = getHeadingCaseClass(data.headingCase);
    const skills = getSkillList(data.skills);

    const showExperience = shouldRenderSection(data, 'experience');
    const showSkills = shouldRenderSection(data, 'skills');
    const showProjects = shouldRenderSection(data, 'projects');
    const showEducation = shouldRenderSection(data, 'education');
    const hasRightCol = showSkills || showProjects || showEducation;

    const sectionOrder = normalizeSectionOrder(data.sectionOrder);
    const rightSections = sectionOrder.filter((id) => id === 'skills' || id === 'projects' || id === 'education');

    const contactNodes: React.ReactNode[] = [];
    if (data.email?.trim()) {
        contactNodes.push(
            <a key="email" href={`mailto:${data.email}`} className={`hover:text-blue-600 ${theme.text}`}>{data.email}</a>
        );
    }
    if (data.phone?.trim()) {
        contactNodes.push(<span key="phone">{data.phone}</span>);
    }
    if (data.website?.trim()) {
        contactNodes.push(
            <a key="website" href={`https://${data.website.replace(/^https?:\/\//, '')}`} className={`hover:text-blue-600 ${theme.text}`}>{data.website}</a>
        );
    }

    return (
        <div className="p-8 font-sans text-[10pt] leading-normal bg-gray-50 text-gray-900 h-full">
            <div className="font-roboto">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold">{data.name}</h1>
                    {contactNodes.length > 0 && (
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs mt-1 text-gray-600">
                            {contactNodes.map((node, idx) => (
                                <React.Fragment key={idx}>
                                    {idx > 0 && <span>&bull;</span>}
                                    {node}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </header>

                {shouldRenderSection(data, 'summary') && (
                    <section className="mb-6">
                        <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
                    </section>
                )}
                
                {(showExperience || hasRightCol) && (
                    <div className={showExperience && hasRightCol ? 'grid grid-cols-3 gap-6' : 'space-y-6'}>
                        {showExperience && (
                            <div className={hasRightCol ? 'col-span-2' : ''}>
                                <section className="mb-6 last:mb-0">
                                    <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Experience</SectionHeader>
                                    {data.experience.map(exp => (
                                        <div key={exp.id} className="mb-4 last:mb-0">
                                            <div className="flex justify-between items-start flex-wrap gap-2">
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900">{exp.title}</h3>
                                                    {exp.company && <p className="text-xs text-gray-700">{exp.company}</p>}
                                                </div>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">{exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate}</span>
                                            </div>
                                            <ul className="mt-1 text-xs text-gray-600 list-disc list-outside ml-4 space-y-1">
                                                {exp.description.split('\n').map(cleanBulletLine).filter(Boolean).map((line, i) => <li key={i}>{line}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </section>
                            </div>
                        )}
                        {hasRightCol && (
                            <div className={showExperience ? 'col-span-1 space-y-6' : 'space-y-6'}>
                                {rightSections.map((id) => {
                                    if (id === 'skills' && showSkills) {
                                        return (
                                            <section key="skills">
                                                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Skills</SectionHeader>
                                                <div className="flex flex-wrap gap-1">
                                                    {skills.map((skill, index) => (
                                                        <span key={index} className={`${theme.bgLight} ${theme.textDark} text-[9pt] px-2 py-1 rounded font-roboto-mono font-medium border ${theme.borderLight}`}>{skill}</span>
                                                    ))}
                                                </div>
                                            </section>
                                        );
                                    }
                                    if (id === 'projects' && showProjects) {
                                        return (
                                            <section key="projects">
                                                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Projects</SectionHeader>
                                                {data.projects.map(proj => (
                                                    <div key={proj.id} className="mb-3 last:mb-0">
                                                        <h3 className="text-sm font-bold text-gray-900">{proj.name}</h3>
                                                        <p className="text-xs text-gray-600 mb-1 leading-relaxed">{proj.description}</p>
                                                        {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} className={`text-xs ${theme.text} hover:underline`}>View Project</a>}
                                                    </div>
                                                ))}
                                            </section>
                                        );
                                    }
                                    if (id === 'education' && showEducation) {
                                        return (
                                            <section key="education">
                                                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Education</SectionHeader>
                                                {data.education.map(edu => (
                                                    <div key={edu.id} className="mb-2 last:mb-0">
                                                        <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                                                        <p className="text-xs text-gray-700">{edu.university}</p>
                                                        {(edu.startDate || edu.endDate) && (
                                                            <p className="text-xs text-gray-500">{edu.startDate}{edu.startDate && edu.endDate ? ' - ' : ''}{edu.endDate}</p>
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
        </div>
    );
};