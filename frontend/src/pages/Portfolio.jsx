import React, { useMemo, useRef, useState, useEffect } from "react";
import { mockData } from "../mock/mock";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Separator } from "../components/ui/separator";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../hooks/use-toast";
import {
  Mail,
  FileDown,
  Github,
  Linkedin,
  Instagram,
  X as XIcon,
  Copy,
  MapPin,
  ChevronRight,
  Rocket,
  ShieldCheck,
  Boxes,
} from "lucide-react";

const Section = ({ id, label, children }) => (
  <section id={id} className="container mx-auto max-w-6xl px-6 md:px-8 py-12 md:py-16">
    <div className="label mb-4 uppercase tracking-widest text-[12px] text-[color:var(--accent-primary)]">{label}</div>
    {children}
  </section>
);

const Header = ({ onContactClick, resumeUrl }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border-b border-[color:var(--border-light)]">
      <div className="container mx-auto max-w-6xl px-6 md:px-8 py-4 flex items-center justify-between">
        <div className="header-logo select-none">SUKI</div>
        <nav className="hidden md:flex items-center gap-5">
          {[
            { href: "#about", label: "About" },
            { href: "#skills", label: "Skills" },
            { href: "#experience", label: "Experience" },
            { href: "#projects", label: "Projects" },
            { href: "#contact", label: "Contact" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onContactClick} className="hidden md:inline-flex">
            <Mail className="w-4 h-4 mr-2" /> Contact
          </Button>
          <a href={resumeUrl} target="_blank" rel="noreferrer">
            <Button variant="default" className="bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--accent-foreground)] border-0">
              <FileDown className="w-4 h-4 mr-2" /> Resume
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

const Hero = ({ profile, onContactClick }) => {
  return (
    <div className="container mx-auto max-w-6xl px-6 md:px-8 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-4" style={{
            color: "var(--hero-title-color)",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          }}>
            {profile.name}
          </h1>
          <p className="text-xl md:text-2xl text-[color:var(--text-secondary)] mb-6">{profile.title}</p>
          <p className="text-[color:var(--muted-foreground)] text-base md:text-lg leading-relaxed max-w-2xl">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <Button className="bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--accent-foreground)] border-0">
                <FileDown className="w-4 h-4 mr-2" /> Download Resume
              </Button>
            </a>
            <Button variant="outline" onClick={onContactClick} className="border-[color:var(--border-color)]">
              <Mail className="w-4 h-4 mr-2" /> Get in touch
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-4 text-[color:var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {profile.location}
            </div>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center gap-3">
              <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:opacity-80">
                <Github className="w-5 h-5" />
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:opacity-80">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={profile.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:opacity-80">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={profile.socials.x} target="_blank" rel="noreferrer" aria-label="X" className="hover:opacity-80">
                <XIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <Card className="bg-[color:var(--card)] border-[color:var(--border-light)] p-8 flex items-center justify-center min-h-[240px]">
            <div className="w-28 h-28 rounded-full bg-[rgba(255,255,255,0.06)] border border-[color:var(--border-light)] flex items-center justify-center">
              <span className="text-3xl font-semibold" aria-label="Suki silhouette">S</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Skills = ({ skills }) => {
  return (
    <Section id="skills" label="Core Skills">
      <Tabs defaultValue="primary" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent border border-[color:var(--border-color)]">
          <TabsTrigger value="primary">Primary</TabsTrigger>
          <TabsTrigger value="secondary">Secondary</TabsTrigger>
        </TabsList>
        <TabsContent value="primary" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {skills.primary.map((s) => (
              <Badge key={s} variant="secondary" className="justify-start px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[color:var(--border-light)] hover:translate-y-[-2px] transition-transform">
                {s}
              </Badge>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="secondary" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {skills.secondary.map((s) => (
              <Badge key={s} variant="secondary" className="justify-start px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[color:var(--border-light)] hover:translate-y-[-2px] transition-transform">
                {s}
              </Badge>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Section>
  );
};

const About = ({ profile }) => {
  return (
    <Section id="about" label="About Me">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Engineer who ships reliable cloud systems</h2>
          <p className="text-[color:var(--muted-foreground)] leading-relaxed">
            {profile.intro}
          </p>
        </div>
        <div className="md:col-span-4">
          <Card className="bg-[color:var(--card)] border-[color:var(--border-light)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-4 h-4" /> Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[color:var(--text-secondary)]">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /> AWS architecture &amp; cost optimization</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /> CI/CD pipelines and GitOps
                </li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Infrastructure as Code (Terraform)
                </li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Security &amp; compliance baselines
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
};

const Certifications = ({ items }) => (
  <Section id="certs" label="Certifications">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((cert) => (
        <Card key={cert.name} className="bg-[color:var(--card)] border-[color:var(--border-light)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> {cert.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[color:var(--text-secondary)] text-sm">
              Issuer: {cert.issuer} • Valid till {cert.validTill}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </Section>
);

const Experience = ({ items }) => (
  <Section id="experience" label="Experience">
    <div className="space-y-6">
      {items.map((exp) => (
        <Card key={exp.company} className="bg-[color:var(--card)] border-[color:var(--border-light)]">
          <CardHeader>
            <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span>{exp.role} — <span className="text-[color:var(--text-secondary)]">{exp.company}</span></span>
              <span className="text-sm font-normal text-[color:var(--text-secondary)]">{exp.period}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[color:var(--muted-foreground)] mb-4">{exp.summary}</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[color:var(--text-secondary)]">
              {exp.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2"><Boxes className="w-4 h-4 mt-1 shrink-0" /> {h}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  </Section>
);

const Projects = ({ items }) => (
  <Section id="projects" label="Projects (Selected)">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((p) => (
        <a key={p.name} href={p.link} target="_blank" rel="noreferrer" className="group">
          <Card className="bg-[color:var(--card)] border-[color:var(--border-light)] transition-transform group-hover:-translate-y-1">
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[color:var(--text-secondary)] mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Badge key={t} className="bg-[rgba(255,255,255,0.04)] border border-[color:var(--border-light)]">{t}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  </Section>
);

const Contact = ({ email }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem("suki_contact_msgs") || "[]");
    localStorage.setItem("suki_contact_msgs", JSON.stringify([payload, ...existing]));
    setForm({ name: "", email: "", message: "" });
    toast({ title: "Message saved (mock)", description: "Stored locally. Backend integration comes next.", duration: 3000 });
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    toast({ title: "Email copied", description: email, duration: 2000 });
  };

  return (
    <Section id="contact" label="Contact">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <Card className="bg-[color:var(--card)] border-[color:var(--border-light)]">
            <CardHeader>
              <CardTitle>Reach out</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[color:var(--text-secondary)] mb-4">Prefer email? Copy it or click to open.</p>
              <div className="flex items-center gap-2">
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:opacity-80">
                  <Mail className="w-4 h-4" /> {email}
                </a>
                <Button variant="outline" size="sm" className="h-8 px-2" onClick={copyEmail}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-7">
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="label-small mb-1 block">Your Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" required />
              </div>
              <div>
                <label className="label-small mb-1 block">Your Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" required />
              </div>
            </div>
            <div>
              <label className="label-small mb-1 block">Message</label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project..." rows={5} required />
            </div>
            <div className="pt-2">
              <Button type="submit" className="bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--accent-foreground)] border-0">
                Send Message (Mock)
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
};

const Footer = () => (
  <footer className="border-t border-[color:var(--border-light)] mt-16">
    <div className="container mx-auto max-w-6xl px-6 md:px-8 py-8 text-sm text-[color:var(--text-secondary)] flex items-center justify-between">
      <div className="header-logo">SUKI</div>
      <div>© {new Date().getFullYear()} Suki. All rights reserved.</div>
    </div>
  </footer>
);

export default function Portfolio() {
  const profile = mockData.profile;
  const skills = mockData.skills;
  const experience = mockData.experience;
  const projects = mockData.projects;
  const certifications = mockData.certifications;

  const contactRef = useRef(null);
  const onContactClick = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Decorative top accent bar (under 20% viewport area)
  useEffect(() => {
    document.body.style.background = "hsl(var(--background))";
  }, []);

  return (
    <div>
      <Header onContactClick={onContactClick} resumeUrl={profile.resumeUrl} />
      <div className="relative">
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <div className="h-48 bg-[radial-gradient(ellipse_at_top,rgba(34,162,255,0.22),rgba(11,25,46,0))]"></div>
        </div>
        <Hero profile={profile} onContactClick={onContactClick} />
      </div>
      <Separator className="opacity-40" />
      <About profile={profile} />
      <Skills skills={skills} />
      <Certifications items={certifications} />
      <Experience items={experience} />
      <Projects items={projects} />
      <Contact email={profile.email} ref={contactRef} />
      <Footer />
      <Toaster />
    </div>
  );
}