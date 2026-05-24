"use client";

import { useState } from "react";
import { Send, MapPin, Phone, Mail, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGsapFadeIn } from "@/hooks/use-gsap";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const contactInfo = [
  { icon: MapPin, key: "address", lines: ["Kathmandu, Nepal", "Putalisadak, 44600"] },
  { icon: Phone, key: "phone", lines: ["+977-1-4XXXXXX", "+977-98XXXXXXXX"] },
  { icon: Mail, key: "emailLabel", lines: ["info@loksewahub.com.np", "support@loksewahub.com.np"] },
  { icon: Clock, key: "businessHours", lines: ["contact.hours"] },
];

export default function ContactPage() {
  const { t } = useLocale();
  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const headerRef = useGsapFadeIn();
  const formRef = useGsapFadeIn(0.15);
  const infoRef = useGsapFadeIn(0.3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSuccess(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("contact.title")} subtitle={t("contact.subtitle")} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div ref={formRef} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("contact.sendMessage")}</CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                    {t("contact.success")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("contact.name")}</label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t("contact.name")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("contact.email")}</label>
                      <Input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={t("contact.email")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("contact.subject")}</label>
                    <Input
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={t("contact.subject")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("contact.message")}</label>
                    <Textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t("contact.message")}
                    />
                  </div>
                  <Button type="submit" size="lg" disabled={sending}>
                    {sending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("contact.sending")}</>
                    ) : (
                      <><Send className="h-4 w-4 mr-2" />{t("contact.sendMessage")}</>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div ref={infoRef} className="space-y-4">
          {contactInfo.map((item) => (
            <Card key={item.key}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{t(`contact.${item.key}`)}</h3>
                  {item.lines.map((line, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {line.startsWith("contact.") ? t(line) : line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
