import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, Bot, Palette, FileText, MessageSquareQuote, SearchCheck, FileSignature } from 'lucide-react';
import { ResumePreview } from '../components/builder/ResumePreview';
import type { ResumeData, TemplateId } from '../types';

// Sample data and templates to populate previews on the home page.
const sampleResumeData: ResumeData = {
  name: 'Syed Ali',
  email: 'syed@email.com',
  phone: '555-123-4567',
  website: 'syedali.dev',
  summary: 'Software Engineer with 3+ years of experience building web applications.',
  skills: 'JavaScript, React, Node.js, Python',
  education: [
    { id: 'edu-1', university: 'Karachi University', degree: 'B.S. Computer Science', startDate: '2018', endDate: '2022' },
  ],
  experience: [
    { id: 'exp-1', company: 'Tech Corp', title: 'Software Engineer', startDate: '2022', endDate: 'Present', description: '• Built web applications\n• Collaborated with team' },
    { id: 'exp-2', company: 'StartupXYZ', title: 'Junior Developer', startDate: '2021', endDate: '2022', description: '• Developed mobile apps\n• Fixed bugs and issues' },
  ],
  projects: [
    { id: 'proj-1', name: 'Portfolio Site', description: 'Personal website built with React.', url: '' },
    { id: 'proj-2', name: 'Task Manager', description: 'Todo app with React and Node.js.', url: '' },
    { id: 'proj-3', name: 'Weather App', description: 'Real-time weather using API.', url: '' },
  ],
};

const templates: { id: TemplateId; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'creative', name: 'Creative' },
  { id: 'technical', name: 'Technical' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'academic', name: 'Academic' },
  { id: 'executive', name: 'Executive' },
  { id: 'infographic', name: 'Infographic' },
  { id: 'startup', name: 'Startup' },
];


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-6 text-center shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:border-primary/30 hover:-translate-y-2">
    <div className="flex justify-center mb-6">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold bg-gradient-to-r from-lime-400 to-emerald-500 text-transparent bg-clip-text">{title}</h3>
    <p className="mt-2 text-muted-foreground">{children}</p>
  </div>
);

const HowItWorksStep: React.FC<{ number: string, title: string, children: string }> = ({ number, title, children }) => (
    <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-16 h-16 border-2 border-primary/20 rounded-full text-2xl font-bold text-primary mb-4">{number}</div>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">{title}</h3>
        <p className="mt-2 text-muted-foreground max-w-xs">{children}</p>
    </div>
);


const HomePage: React.FC = () => {
  const templatePairs = React.useMemo(() => {
    const pairs = [];
    if (templates.length === 0) return [];
    for (let i = 0; i < templates.length; i += 2) {
      if (templates[i + 1]) {
        pairs.push([templates[i], templates[i + 1]]);
      } else {
        // Handle the last odd template by pairing it with the first one
        pairs.push([templates[i], templates[0]]);
      }
    }
    return pairs;
  }, []);

  const [currentPairIndex, setCurrentPairIndex] = React.useState(0);
  const [currentTemplateIndex, setCurrentTemplateIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPairIndex((prevIndex) => (prevIndex + 1) % templatePairs.length);
    }, 4000); // Change template pair every 4 seconds
    return () => clearInterval(timer);
  }, [templatePairs.length]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTemplateIndex((prevIndex) => (prevIndex + 1) % templates.length);
    }, 2000); // Change template every 2 seconds
    return () => clearInterval(timer);
  }, [templates.length]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-16 space-y-24 md:space-y-32">
      
      {/* Hero Section */}
      <section className="container mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Build Your Perfect Resume with 
                    <span className="block mt-2 md:mt-4 bg-gradient-to-r from-primary to-foreground/70 text-transparent bg-clip-text">AI Architect</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto lg:mx-0 text-lg text-muted-foreground">
                    Leverage the power of Google Gemini to craft a professional resume that gets you noticed. AI-powered summaries, bullet points, and skill suggestions tailored to your dream job.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                    <Link to="/builder">
                        Start Building for Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    </Button>
                </div>
            </div>
             <div className="hidden lg:flex justify-center items-end relative overflow-hidden pt-20">
                <div className="relative w-[500px] h-[500px]">
                  {/* Empty space gradient background */}
                  <div className="absolute -top-20 inset-x-0 h-20 bg-gradient-to-b from-transparent to-background/10 pointer-events-none" />
                  
                  {/* Background floating templates */}
                  {templates.map((template, index) => {
                    const delay = index * 0.5;
                    const isActive = index === currentTemplateIndex;
                    return (
                      <div
                        key={template.id}
                        className={`absolute transition-all duration-1000 ease-in-out ${
                          isActive ? 'opacity-100 z-20 scale-100' : 'opacity-30 z-10 scale-90'
                        }`}
                        style={{
                          left: `${20 + (index % 3) * 120}px`,
                          top: `${120 + Math.sin(index) * 80}px`,
                          transform: `rotate(${isActive ? '0deg' : `${-15 + (index % 3) * 15}deg`}) translateY(${Math.sin(Date.now() / 1000 + delay) * 10}px)`,
                          animationDelay: `${delay}s`
                        }}
                      >
                        <div className={`w-[180px] h-[230px] transition-all duration-1000 ${
                          isActive ? 'shadow-2xl shadow-primary/20 border-2 border-primary/20' : 'shadow-lg'
                        }`}>
                          <div className="scale-[0.23] origin-top-left w-[435%] h-[435%]">
                            <ResumePreview data={sampleResumeData} template={template.id} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Enhanced floating particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full animate-pulse"
                        style={{
                          left: `${30 + i * 60}px`,
                          top: `${80 + i * 50}px`,
                          animationDelay: `${i * 0.4}s`,
                          animationDuration: '4s'
                        }}
                      />
                    ))}
                  </div>
                </div>
            </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold">Why Choose AI Architect?</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Everything you need to succeed, powered by intelligent technology.</p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={<Bot className="h-8 w-8 text-primary" />} title="AI Assistant">
            Generate summaries, enhance descriptions, and get skill suggestions with a single click.
          </FeatureCard>
          <FeatureCard icon={<Palette className="h-8 w-8 text-primary" />} title="Modern Templates">
            Choose from a variety of professional templates to match your style and industry.
          </FeatureCard>
          <FeatureCard icon={<SearchCheck className="h-8 w-8 text-primary" />} title="ATS Optimization">
             Beat the bots. Optimize your resume with AI-suggested keywords to get past automated screening.
          </FeatureCard>
          <FeatureCard icon={<FileText className="h-8 w-8 text-primary" />} title="PDF Export">
            Download your finished resume as a high-quality, pixel-perfect PDF, ready to send.
          </FeatureCard>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold">Get Started in 3 Easy Steps</h2>
        <div className="relative mt-12">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 -translate-y-4">
                 <div className="w-full h-full bg-repeat-x bg-center" style={{backgroundImage: `linear-gradient(to right, hsl(var(--border)) 50%, transparent 50%)`, backgroundSize: '16px 1px'}}></div>
            </div>
            <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-8">
                <HowItWorksStep number="01" title="Choose a Template">Select from our library of professional, field-tested resume designs.</HowItWorksStep>
                <HowItWorksStep number="02" title="Enhance with AI">Use the AI Assistant to generate and refine your resume content effortlessly.</HowItWorksStep>
                <HowItWorksStep number="03" title="Download PDF">Export your final resume in a clean, professional PDF format.</HowItWorksStep>
            </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold">Find Your Perfect Style</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Our templates automatically cycle below. See one you like? Head to the builder!</p>
        
        <div className="mt-10 w-full max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            {templatePairs.map((pair, index) => (
              <div
                key={index}
                className={`transition-opacity duration-1000 ease-in-out ${
                  index === currentPairIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {pair.map((template) => (
                    <div key={template.id}>
                      <Link to="/templates" className="block group">
                        <div className="border rounded-lg overflow-hidden transition-all group-hover:shadow-xl group-hover:-translate-y-1 duration-300 ease-in-out bg-card">
                          <div className="overflow-hidden aspect-[8.5/9] pointer-events-none">
                            <div className="scale-[0.4] sm:scale-[0.37] origin-top-left w-[250%] sm:w-[270%] h-[250%] sm:h-[270%]">
                              <ResumePreview data={sampleResumeData} template={template.id} />
                            </div>
                          </div>
                        </div>
                      </Link>
                      <h3 className="text-center mt-4 text-lg font-medium">
                        {template.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center gap-2">
            {templatePairs.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPairIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  index === currentPairIndex ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to template pair ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild className="bg-gradient-to-r from-lime-400 to-emerald-500 text-primary-foreground hover:opacity-90">
            <Link to="/templates">
              Explore All Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      
       {/* Cover Letter Section */}
      <section className="w-full max-w-4xl">
         <div className="relative rounded-2xl p-8 md:p-12 bg-card border shadow-lg overflow-hidden">
             <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="hidden md:flex justify-center items-center">
                    <div className="relative w-40 h-40">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
                        <FileSignature className="relative w-full h-full text-primary/80" strokeWidth={1.5}/>
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold">Go Beyond the Resume</h2>
                    <p className="mt-4 text-muted-foreground max-w-md mx-auto md:mx-0">
                       Our AI can also write a professional cover letter tailored to the job description, using your resume for context.
                    </p>
                    <div className="mt-6">
                        <Button asChild>
                            <Link to="/cover-letter">
                                Generate Cover Letter
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
             </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-4xl">
         <div className="relative rounded-2xl p-8 md:p-16 bg-card border shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 dark:opacity-30 -z-10"></div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-lime-400 to-emerald-500 text-transparent bg-clip-text">Ready to Land Your Dream Job?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Start building your standout resume today. It’s fast, easy, and powered by the latest AI technology.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/builder">
                  Create My Resume Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
         </div>
      </section>
      
      {/* Contact Us Section */}
      <section className="w-full max-w-4xl">
         <div className="relative rounded-2xl p-8 md:p-12 bg-card border shadow-lg overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-50 dark:opacity-30 -z-10"></div>
             <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">Have Questions?</h2>
                    <p className="mt-4 text-muted-foreground max-w-md mx-auto md:mx-0">
                        We're here to help. If you have any questions about the app or just want to connect, feel free to reach out.
                    </p>
                    <div className="mt-6">
                        <Button asChild>
                            <Link to="/contact">
                                Contact Us
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="hidden md:flex justify-center items-center">
                    <div className="relative w-40 h-40">
                        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl"></div>
                        <MessageSquareQuote className="relative w-full h-full text-blue-400/80" strokeWidth={1.5}/>
                    </div>
                </div>
             </div>
         </div>
      </section>

    </div>
  );
};

export default HomePage;