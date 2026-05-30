"use client";

import { LocaleLink } from "@/components/shared/LocaleLink";
import {
  ArrowRight, BookOpen, FileText, Brain, ClipboardCheck,
  TrendingUp, Bell, Sparkles, GraduationCap, Landmark, Building,
  Scale, Shield, ShieldCheck, Sword, Search, ExternalLink, Car,
  Wallet, Trees, Map, IdCard, Plane, Stethoscope, School,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/providers/locale-provider";
import { useGsapFadeIn, useGsapCounter } from "@/hooks/use-gsap";

const highlights = [
  { icon: Brain, labelKey: "AI Questions", desc: "Predict probable questions with AI" },
  { icon: Sparkles, labelKey: "AI Tutor", desc: "Learn with AI in Nepali & English" },
  { icon: ClipboardCheck, labelKey: "Mock Tests", desc: "Timed tests with analytics" },
  { icon: TrendingUp, labelKey: "Current Affairs", desc: "Last 90 days updated daily" },
  { icon: BookOpen, labelKey: "Notes Library", desc: "Subject-wise study materials" },
  { icon: Bell, labelKey: "Notices", desc: "All government vacancies in one place" },
];

const governmentBodies = [
  {
    category: "exam-authorities",
    items: [
      { name: "Loksewa Aayog (Public Service Commission)", nameNe: "लोक सेवा आयोग", url: "/psc", icon: GraduationCap },
      { name: "Teacher Service Commission", nameNe: "शिक्षक सेवा आयोग", url: "https://tsc.gov.np", icon: GraduationCap },
      { name: "Koshi Province PSC", nameNe: "कोशी प्रदेश लोक सेवा", url: "https://psc.koshi.gov.np", icon: GraduationCap },
      { name: "Madhesh Province PSC", nameNe: "मधेश प्रदेश लोक सेवा", url: "https://ppsc.madhesh.gov.np", icon: GraduationCap },
      { name: "Bagmati Province PSC", nameNe: "बागमती प्रदेश लोक सेवा", url: "https://spsc.bagamati.gov.np", icon: GraduationCap },
      { name: "Gandaki Province PSC", nameNe: "गण्डकी प्रदेश लोक सेवा", url: "https://ppsc.gandaki.gov.np", icon: GraduationCap },
      { name: "Lumbini Province PSC", nameNe: "लुम्बिनी प्रदेश लोक सेवा", url: "https://ppsc.lumbini.gov.np", icon: GraduationCap },
      { name: "Karnali Province PSC", nameNe: "कर्णाली प्रदेश लोक सेवा", url: "https://ppsc.karnali.gov.np", icon: GraduationCap },
      { name: "Sudurpashchim Province PSC", nameNe: "सुदूरपश्चिम प्रदेश लोक सेवा", url: "https://psc.sudurpashchim.gov.np", icon: GraduationCap },
    ],
  },
  {
    category: "ministries",
    items: [
      { name: "Ministry of Finance", nameNe: "अर्थ मन्त्रालय", url: "https://www.mof.gov.np", icon: Building },
      { name: "Ministry of Home Affairs", nameNe: "गृह मन्त्रालय", url: "https://www.moha.gov.np", icon: Building },
      { name: "Ministry of Foreign Affairs", nameNe: "परराष्ट्र मन्त्रालय", url: "https://mofa.gov.np", icon: Building },
      { name: "Ministry of Education", nameNe: "शिक्षा मन्त्रालय", url: "https://www.moe.gov.np", icon: Building },
      { name: "Ministry of Health", nameNe: "स्वास्थ्य मन्त्रालय", url: "https://mohp.gov.np", icon: Building },
      { name: "Ministry of Defence", nameNe: "रक्षा मन्त्रालय", url: "https://mod.gov.np", icon: Building },
      { name: "Ministry of Agriculture", nameNe: "कृषि मन्त्रालय", url: "https://www.moald.gov.np", icon: Building },
      { name: "Ministry of Law & Justice", nameNe: "कानुन मन्त्रालय", url: "https://www.moljpa.gov.np", icon: Building },
      { name: "Ministry of Communication & IT", nameNe: "सञ्चार मन्त्रालय", url: "https://www.mocit.gov.np", icon: Building },
      { name: "Ministry of Energy", nameNe: "ऊर्जा मन्त्रालय", url: "https://www.moewri.gov.np", icon: Building },
      { name: "Ministry of Labour", nameNe: "श्रम मन्त्रालय", url: "https://www.moless.gov.np", icon: Building },
      { name: "Ministry of Culture & Tourism", nameNe: "संस्कृति मन्त्रालय", url: "https://www.tourism.gov.np", icon: Building },
    ],
  },
  {
    category: "constitutional",
    items: [
      { name: "Election Commission", nameNe: "निर्वाचन आयोग", url: "https://www.election.gov.np", icon: Scale },
      { name: "CIAA", nameNe: "अख्तियार दुरुपयोग अनुसन्धान आयोग", url: "https://ciaa.gov.np", icon: Scale },
      { name: "Office of the Auditor General", nameNe: "महालेखापरीक्षकको कार्यालय", url: "https://www.oag.gov.np", icon: Scale },
      { name: "Nepal Rastra Bank", nameNe: "नेपाल राष्ट्र बैंक", url: "/nrb", icon: Landmark },
    ],
  },
  {
    category: "security",
    items: [
      { name: "Nepal Police", nameNe: "नेपाल प्रहरी", url: "/nepal-police", icon: Shield },
      { name: "Armed Police Force", nameNe: "सशस्त्र प्रहरी बल", url: "https://www.apf.gov.np", icon: ShieldCheck },
      { name: "Nepali Army", nameNe: "नेपाली सेना", url: "https://www.nepalarmy.mil.np", icon: Sword },
      { name: "National Investigation Dept.", nameNe: "राष्ट्रिय अनुसन्धान विभाग", url: "https://www.nid.gov.np", icon: Search },
    ],
  },
  {
    category: "departments",
    items: [
      { name: "Dept. of Transport Management", nameNe: "यातायात व्यवस्था विभाग", url: "https://www.dotm.gov.np", icon: Car },
      { name: "Dept. of Passports", nameNe: "राहदानी विभाग", url: "https://www.dop.gov.np", icon: IdCard },
      { name: "Dept. of Immigration", nameNe: "अध्यागमन विभाग", url: "https://www.immigration.gov.np", icon: Plane },
      { name: "Inland Revenue Dept.", nameNe: "आन्तरिक राजस्व विभाग", url: "https://www.ird.gov.np", icon: Wallet },
      { name: "Dept. of Customs", nameNe: "भन्सार विभाग", url: "https://www.customs.gov.np", icon: Landmark },
      { name: "Dept. of Education", nameNe: "शिक्षा विभाग", url: "https://www.doe.gov.np", icon: School },
      { name: "Dept. of Health Services", nameNe: "स्वास्थ्य सेवा विभाग", url: "https://www.dohs.gov.np", icon: Stethoscope },
      { name: "Dept. of Forests", nameNe: "वन विभाग", url: "https://www.dof.gov.np", icon: Trees },
      { name: "Dept. of Survey", nameNe: "नापी विभाग", url: "https://www.dos.gov.np", icon: Map },
      { name: "National Planning Commission", nameNe: "राष्ट्रिय योजना आयोग", url: "https://www.npc.gov.np", icon: Building },
    ],
  },
];

export default function HomePage() {
  const { t, locale } = useLocale();
  const statsRef = useGsapFadeIn(0.1);
  const highlightsRef = useGsapFadeIn(0.2);
  const ctaRef = useGsapFadeIn(0.4);
  const studentsRef = useGsapCounter(50000);
  const noticesRef = useGsapCounter(15000);
  const questionsRef = useGsapCounter(100000);
  const examsRef = useGsapCounter(200);

  return (
    <div className="flex flex-col">
      {/* Minimal Hero - just a simple header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-1 h-3.5 w-3.5" />{locale === "ne" ? "सरकारी निकायहरू" : "Government Bodies"}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {locale === "ne" ? "सरकारी परीक्षाको तयारी" : "Government Exam Preparation"}
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            {locale === "ne" ? "लोकसेवा, शिक्षक सेवा, बैंकिङ र सबै सरकारी परीक्षाको तयारी" : "Nepal's platform for Loksewa, TSC, Banking & government exam preparation"}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <LocaleLink href="/notes"><Button size="lg" className="gap-2">{t("home.heroCta")}<ArrowRight className="h-4 w-4" /></Button></LocaleLink>
            <LocaleLink href="/notices"><Button variant="outline" size="lg">{t("home.heroCtaSecondary")}</Button></LocaleLink>
          </div>
          {/* Compact Stats */}
          <div ref={statsRef} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-2xl mx-auto">
            {[
              { ref: studentsRef, label: t("home.statsStudents"), suffix: "+" },
              { ref: noticesRef, label: t("home.statsNotices"), suffix: "+" },
              { ref: questionsRef, label: t("home.statsQuestions"), suffix: "+" },
              { ref: examsRef, label: t("home.statsExams"), suffix: "+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-primary"><span ref={stat.ref}>0</span>{stat.suffix}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Highlights */}
      <section ref={highlightsRef} className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">{t("home.featuresTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{t("home.featuresSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <LocaleLink key={i} href="/notes" className="group block p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{item.labelKey}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </LocaleLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* Government Bodies */}
      <section className="border-t bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3"><Landmark className="mr-1 h-3.5 w-3.5" />{t("home.govtMinistries")}</Badge>
            <h2 className="text-3xl font-bold">{t("home.governmentTitle")}</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{t("home.governmentSubtitle")}</p>
          </div>
          <div className="space-y-10">
            {governmentBodies.map((group) => (
              <div key={group.category}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  <span>{group.category === "exam-authorities" ? t("home.govtExamAuthorities") : group.category === "ministries" ? t("home.govtMinistries") : group.category === "constitutional" ? t("home.govtConstitutional") : group.category === "security" ? t("home.govtSecurity") : t("home.govtDepartments")}</span>
                  <span className="h-px flex-1 bg-border" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {group.items.map((body) => {
                    const Icon = body.icon;
                    const isInternal = body.url.startsWith("/");
                    const cardBody = (
                      <>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{locale === "ne" ? body.nameNe : body.name}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            {isInternal ? (locale === "ne" ? "लाइभ डाटा हेर्नुहोस्" : "View Live Data") : t("home.visitWebsite")}
                            {isInternal ? null : <ExternalLink className="h-3 w-3 inline" />}
                          </p>
                        </div>
                      </>
                    );
                    return isInternal ? (
                      <LocaleLink key={body.name} href={body.url}
                        className="group flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        {cardBody}
                      </LocaleLink>
                    ) : (
                      <a key={body.name} href={body.url} target="_blank" rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        {cardBody}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="border-t bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">{t("home.ctaTitle")}</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">{t("home.ctaSubtitle")}</p>
          <div className="mt-6">
            <LocaleLink href="/dashboard"><Button size="lg" className="gap-2">{t("home.ctaButton")}<ArrowRight className="h-4 w-4" /></Button></LocaleLink>
          </div>
        </div>
      </section>
    </div>
  );
}
