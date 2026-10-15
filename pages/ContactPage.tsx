import * as React from 'react';
import { Button } from '../components/ui/Button';
import { Linkedin, Github, Instagram, Send, Loader2, CheckCircle, AlertCircle, Mail, MapPin } from 'lucide-react';

const SocialRow: React.FC<{ href: string; icon: React.ReactNode; label: string; sub: string }> = ({ href, icon, label, sub }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-4 p-4 rounded-xl border border-[#e0e2e8] dark:border-[#2c2c34] bg-white dark:bg-[#1a1a1e] hover:border-[#1c1c1e] dark:hover:border-white transition-all"
  >
    <div className="flex size-10 items-center justify-center rounded-xl bg-[#f7f8fa] dark:bg-[#242428] text-[#1c1c1e] dark:text-white group-hover:bg-[#ffd02f] group-hover:text-[#1c1c1e] transition-colors flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-[#1c1c1e] dark:text-white">{label}</p>
      <p className="text-xs text-[#6b6f7e] dark:text-[#a5a8b5]">{sub}</p>
    </div>
    <Send className="ml-auto size-3.5 text-[#a5a8b5] group-hover:text-[#1c1c1e] dark:group-hover:text-white transition-colors rotate-45 flex-shrink-0" aria-hidden="true" />
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

  const inputClass = 'w-full h-11 px-4 py-2.5 bg-white dark:bg-[#1a1a1e] border border-[#c7cad5] dark:border-[#3b3b45] rounded-lg text-sm text-[#1c1c1e] dark:text-white placeholder:text-[#a5a8b5] focus-visible:outline-none focus-visible:border-[#4262ff] focus-visible:ring-2 focus-visible:ring-[#4262ff]/20 transition-all disabled:opacity-50';
  const textareaClass = 'w-full min-h-[140px] px-4 py-3 bg-white dark:bg-[#1a1a1e] border border-[#c7cad5] dark:border-[#3b3b45] rounded-lg text-sm text-[#1c1c1e] dark:text-white placeholder:text-[#a5a8b5] focus-visible:outline-none focus-visible:border-[#4262ff] focus-visible:ring-2 focus-visible:ring-[#4262ff]/20 transition-all disabled:opacity-50 resize-none';

  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-[#141416] text-[#1c1c1e] dark:text-white transition-colors">
      
      {/* Header */}
      <div className="w-full text-center py-16 md:py-20 px-6 max-w-[1280px] mx-auto">
        <span className="bg-[#fff8e0] text-[#746019] text-[13px] font-semibold rounded-full px-4 py-1.5 mb-4 inline-block">
          REACH OUT
        </span>
        <h1 className="font-display-lg text-[#1c1c1e] dark:text-white mb-4 text-balance">
          Get in touch with us.
        </h1>
        <p className="font-subtitle text-[#555a6a] dark:text-[#a5a8b5] max-w-sm mx-auto">
          Have feedback, need assistance, or want to discuss enterprise features? We’d love to hear from you.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-[1fr_320px] gap-10 items-start">

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5 bg-[#f7f8fa] dark:bg-[#16161a] p-8 rounded-2xl border border-[#e0e2e8] dark:border-[#2c2c34]">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-semibold text-[#555a6a] dark:text-[#a5a8b5] uppercase tracking-wider">Your Name</label>
                <input id="name" type="text" name="name" placeholder="Syed Ali" className={inputClass} required autoComplete="name" disabled={status === 'submitting'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-semibold text-[#555a6a] dark:text-[#a5a8b5] uppercase tracking-wider">Email Address</label>
                <input id="email" type="email" name="_replyto" placeholder="syed@example.com" className={inputClass} required autoComplete="email" spellCheck={false} disabled={status === 'submitting'} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-semibold text-[#555a6a] dark:text-[#a5a8b5] uppercase tracking-wider">Message</label>
              <textarea id="message" name="message" placeholder="How can we help your job hunt or company?" className={textareaClass} required disabled={status === 'submitting'} />
            </div>

            <Button type="submit" disabled={status === 'submitting' || status === 'success'} className="btn-miro-primary w-full sm:w-auto h-[46px] px-8 text-sm">
              {status === 'submitting' && <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />}
              {status === 'success' && <CheckCircle className="size-4 mr-2" aria-hidden="true" />}
              {status === 'submitting' ? 'Sending Message…' : status === 'success' ? 'Message Sent!' : 'Send Message'}
            </Button>

            {feedbackMessage && (
              <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
                status === 'success'
                  ? 'bg-[#c3faf5] text-[#187574]'
                  : 'bg-[#ffc6c6] text-[#600000]'
              }`}>
                {status === 'success' ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
                <span>{feedbackMessage}</span>
              </div>
            )}
          </form>

          {/* Social and Info Sidebar */}
          <div className="space-y-4">
            <SocialRow
              href="https://www.linkedin.com/in/alihashmi2288"
              icon={<Linkedin className="size-5" />}
              label="LinkedIn"
              sub="Professional Profile"
            />
            <SocialRow
              href="https://www.github.com/alihashmi2288"
              icon={<Github className="size-5" />}
              label="GitHub"
              sub="Open Source Projects"
            />
            <SocialRow
              href="https://www.instagram.com/hashmi.ali_1/"
              icon={<Instagram className="size-5" />}
              label="Instagram"
              sub="Personal Updates"
            />

            <div className="p-6 rounded-2xl bg-[#fff8e0] text-[#746019] border border-[#fcb900]/30 mt-6">
              <span className="font-bold text-xs uppercase tracking-wider block mb-1">Direct Developer Note</span>
              <p className="text-xs leading-relaxed">
                Created by Syed Ali Hashmi. Feel free to connect for software engineering collaborations, feedback, or custom resume architecture features!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;