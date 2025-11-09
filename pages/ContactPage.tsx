import * as React from 'react';
import { Button } from '../components/ui/Button';
import { Linkedin, Github, Instagram, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full h-10 px-3 py-2 bg-transparent border rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className="w-full min-h-[120px] px-3 py-2 bg-transparent border rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
);

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode }> = ({ href, icon, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
        {icon}
        {children}
    </a>
);

const ContactPage: React.FC = () => {
  const FORM_ENDPOINT = "https://formspree.io/f/xkgkwqvg";
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setFeedbackMessage('');

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        setFeedbackMessage('Thank you! Your message has been sent successfully.');
        form.reset();
        setTimeout(() => setStatus('idle'), 5000); // Reset form status after 5 seconds
      } else {
        const responseData = await response.json();
        // Fix: Replaced Object.hasOwn with Object.prototype.hasOwnProperty.call for better compatibility.
        if (Object.prototype.hasOwnProperty.call(responseData, 'errors')) {
            setFeedbackMessage(responseData["errors"].map((error: { message: string }) => error["message"]).join(", "));
        } else {
            setFeedbackMessage('Oops! There was a problem submitting your form.');
        }
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      setFeedbackMessage('Oops! There was a network error. Please try again later.');
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="relative bg-card border rounded-xl shadow-lg overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[150%] bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-full blur-3xl opacity-50 dark:opacity-30 -z-10"></div>
        
        <div className="p-8 md:p-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-foreground/70 text-transparent bg-clip-text">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have a question or want to connect? Send a message or find me online.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                <Input id="name" type="text" name="name" placeholder="John Doe" disabled={status === 'submitting'}/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email</label>
                <Input id="email" type="email" name="_replyto" placeholder="john@example.com" disabled={status === 'submitting'}/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <Textarea id="message" name="message" placeholder="Your message here..." disabled={status === 'submitting'}/>
              </div>
              <Button type="submit" disabled={status === 'submitting' || status === 'success'}>
                {status === 'submitting' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : status === 'success' ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                    <Send className="w-4 h-4 mr-2" />
                )}
                {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
              </Button>
              {status === 'success' && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-4" role="alert">
                  <CheckCircle className="w-5 h-5" />
                  <p>{feedbackMessage}</p>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-sm text-destructive mt-4" role="alert">
                  <AlertCircle className="w-5 h-5" />
                  <p>{feedbackMessage}</p>
                </div>
              )}
            </form>

            {/* Social Links */}
            <div className="space-y-6 md:pt-8">
                <h3 className="text-lg font-semibold text-center md:text-left bg-gradient-to-r from-lime-400 to-emerald-500 text-transparent bg-clip-text">Connect with me</h3>
                <div className="flex flex-col items-center md:items-start gap-4">
                    <SocialLink href="https://www.linkedin.com/in/alihashmi2288" icon={<Linkedin className="w-5 h-5" />}>
                        LinkedIn
                    </SocialLink>
                    <SocialLink href="https://www.github.com/alihashmi2288" icon={<Github className="w-5 h-5" />}>
                        GitHub
                    </SocialLink>
                    <SocialLink href="https://www.instagram.com/hashmi.ali_1/" icon={<Instagram className="w-5 h-5" />}>
                        Instagram
                    </SocialLink>
                </div>
                 <p className="text-xs text-muted-foreground text-center md:text-left pt-4">
                   Form submissions are handled by a third-party service. I'll get back to you as soon as possible.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;