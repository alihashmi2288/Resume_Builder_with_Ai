import * as React from 'react';
import type { ResumeData } from '../../types';
import { getThemeClasses } from '../../lib/colors';
import {
    cleanBulletLine,
    getHeadingCaseClass,
    getVisibleContactItems,
    normalizeSectionOrder,
    shouldRenderSection,
    type SectionId,
} from '../../lib/resumeUtils';

const SectionHeader: React.FC<{ children: React.ReactNode; theme: any; headingCaseClass: string }> = ({ children, theme, headingCaseClass }) => (
    <h2 className={`text-xs font-semibold ${headingCaseClass} tracking-[.2em] ${theme.text} mb-4 mt-6 first:mt-0`}>
        {children}
    </h2>
);

export const MinimalistTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const theme = getThemeClasses(data.themeColor);
    const headingCaseClass = getHeadingCaseClass(data.headingCase);
    const contactItems = getVisibleContactItems(data);
    const order = normalizeSectionOrder(data.sectionOrder);

    const sectionMap: Record<SectionId, () => React.ReactNode> = {
        summary: () => (
            <section className="mb-4">
                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Profile</SectionHeader>
                <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
            </section>
        ),
        experience: () => (
            <section className="mb-4">
                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Experience</SectionHeader>
                {data.experience.map(exp => (
                    <div key={exp.id} className="mb-5 last:mb-0 grid grid-cols-4 gap-4">
                        <div className="col-span-1 text-xs text-gray-600">
                            <p className="font-semibold text-gray-900">{exp.company}</p>
                            {(exp.startDate || exp.endDate) && (
                                <p className="text-[10px] mt-0.5">{exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate}</p>
                            )}
                        </div>
                        <div className="col-span-3">
                            <h3 className="text-sm font-semibold text-gray-900">{exp.title}</h3>
                            <ul className="list-disc list-outside ml-4 mt-1 text-xs text-gray-700 space-y-1">
                                {exp.description.split('\n').map(cleanBulletLine).filter(Boolean).map((line, i) => <li key={i}>{line}</li>)}
                            </ul>
                        </div>
                    </div>
                ))}
            </section>
        ),
        skills: () => (
            <section className="mb-4">
                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Skills</SectionHeader>
                <p className="text-xs text-gray-700 leading-relaxed">{data.skills}</p>
            </section>
        ),
        education: () => (
            <section className="mb-4">
                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Education</SectionHeader>
                {data.education.map(edu => (
                    <div key={edu.id} className="mb-3 last:mb-0 text-xs grid grid-cols-4 gap-4">
                        <div className="col-span-1 text-gray-600">
                            <p className="font-semibold text-gray-900">{edu.university}</p>
                            {(edu.startDate || edu.endDate) && (
                                <span className="text-gray-500 text-[10px]">{edu.startDate}{edu.startDate && edu.endDate ? ' - ' : ''}{edu.endDate}</span>
                            )}
                        </div>
                        <div className="col-span-3">
                            <h3 className="text-sm font-semibold text-gray-900">{edu.degree}</h3>
                        </div>
                    </div>
                ))}
            </section>
        ),
        projects: () => (
            <section className="mb-4">
                <SectionHeader theme={theme} headingCaseClass={headingCaseClass}>Projects</SectionHeader>
                {data.projects.map(proj => (
                    <div key={proj.id} className="mb-3 last:mb-0 text-xs">
                        <div className="flex items-baseline flex-wrap gap-2">
                            <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                            {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className={`text-xs ${theme.text} hover:underline`}>View Project</a>}
                        </div>
                        <p className="text-gray-700 leading-relaxed mt-1">{proj.description}</p>
                    </div>
                ))}
            </section>
        ),
    };

    return (
        <div className="p-12 font-light font-sans text-[10pt] leading-relaxed bg-white text-gray-800 h-full">
            <header className="text-center mb-10 bg-white text-black">
                <h1 className="text-4xl font-normal tracking-widest leading-tight">{data.name.toUpperCase()}</h1>
                {contactItems.length > 0 && (
                    <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-1 text-xs mt-2 text-gray-500 tracking-wider">
                        {contactItems.map((item, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <span>/</span>}
                                <span>{item}</span>
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </header>

            <hr className="border-gray-200 mb-6" />

            {order.map(sectionId => {
                const typedId = sectionId as SectionId;
                if (!shouldRenderSection(data, typedId)) return null;
                const renderFn = sectionMap[typedId];
                return renderFn ? <React.Fragment key={sectionId}>{renderFn()}</React.Fragment> : null;
            })}
        </div>
    );
};