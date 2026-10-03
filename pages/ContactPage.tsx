import * as React from 'react';
import { Button } from '../components/ui/Button';
import { Linkedin, Github, Instagram, Send, Loader2, CheckCircle, AlertCircle, Mail, MapPin } from 'lucide-react';

const SocialRow: React.FC<{ href: string; icon: React.ReactNode; label: string; sub: string }> = ({ href, icon, label, sub }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/8 transition-all duration-300"
  >
    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary group-hover:bg-primary/15 transition-colors flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
    <Send className="ml-auto size-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors rotate-45 flex-shrink-0" aria-hidden="true" />
  </a>
);

const ContactPage: React.FC = () => {
  const FORM_ENDPOINT = 'https://formspree.io/f/xkgkwqvg';
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setFeedbackMessage('');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (response.ok) {
        setStatus('success');
        setFeedbackMessage('Thank you! Your message has been sent successfully.');
        form.reset();
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        const responseData = await response.json();
        if (Object.prototype.hasOwnProperty.call(responseData, 'errors')) {
          setFeedbackMessage(responseData['errors'].map((err: { message: string }) => err.message).join(', '));
        } else {
          setFeedbackMessage('Oops! There was a problem submitting your form.');
        }
        setStatus('error');
      }
    } catch {
      setStatus('error');
      setFeedbackMessage('Oops! There was a network error. Please try again later.');
    }
  };

  const inputClass = 'w-full h-10 px-3 py-2 bg-card border border-border/60 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all disabled:opacity-50';
  const textareaClass = 'w-full min-h-[120px] px-3 py-2 bg-card border border-border/60 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all disabled:opacity-50 resize-none';

  return (
    <div className="flex flex-col items-center">
      {/* Page header */}
      <div className="w-full text-center py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 360, height: 360, background: 'hsl(var(--primary) / 0.09)', filter: 'blur(80px)', top: -100, right: -60 }} />
        <div className="container mx-auto px-4 relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Say hello</p>
          <h1 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-4 text-balance">Get in touch</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto text-pretty">Have a question or want to connect? Fill out the form or find me on socials.</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl pb-20">
        <div className="grid md:grid-cols-[1fr_320px] gap-10 items-start">

          {/* Left — form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Name</label>
                <input id="name" type="text" name="name" placeholder="Jane Smith" className={inputClass} required autocomplete="name" disabled={status === 'submitting'} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <input id="email" type="email" name="_replyto" placeholder="jane@example.com" className={inputClass} required autocomplete="email" spellCheck={false} disabled={status === 'submitting'} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message</label>
              <textarea id="message" name="message" placeholder="Your message here…" className={textareaClass} required disabled={status === 'submitting'} />
            </div>

            <Button type="submit" disabled={status === 'submitting' || status === 'success'} className="w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              {status === 'submitting' && <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />}
              {status === 'success' && <CheckCircle className="size-4 mr-2" aria-hidden="true" />}
              {status === 'idle' && <Send className="size-4 mr-2" aria-hidden="true" />}
              {status === 'submitting' ? 'Sending…' : status === 'success' ? 'Message sent!' : 'Send message'}
            </Button>
 
            {status === 'success' && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40" role="alert">
                <CheckCircle className="size-4 flex-shrink-0" aria-hidden="true" />
                <p className="text-pretty">{feedbackMessage}</p>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-xs text-destructive p-3 rounded-lg bg-destructive/8 border border-destructive/20" role="alert">
                <AlertCircle className="size-4 flex-shrink-0" aria-hidden="true" />
                <p className="text-pretty">{feedbackMessage}</p>
              </div>
            )}
          </form>

          {/* Right — social links */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-5">Connect</p>
            <SocialRow href="https://www.linkedin.com/in/alihashmi2288" icon={<Linkedin className="size-4" aria-hidden="true" />} label="LinkedIn" sub="alihashmi2288" />
            <SocialRow href="https://www.github.com/alihashmi2288" icon={<Github className="size-4" aria-hidden="true" />} label="GitHub" sub="alihashmi2288" />
            <SocialRow href="https://www.instagram.com/hashmi.ali_1/" icon={<Instagram className="size-4" aria-hidden="true" />} label="Instagram" sub="@hashmi.ali_1" />
 
            <div className="flex items-start gap-3 pt-2">
              <Mail className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                Form submissions are handled securely by Formspree. I'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;