"use client";

import { Target, Eye, Heart, Users, Award, Sparkles } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { useGsapCounter } from "@/hooks/use-gsap";

const values = [
  { icon: Heart, key: "value1" },
  { icon: Sparkles, key: "value2" },
  { icon: Award, key: "value3" },
  { icon: Users, key: "value4" },
];

const stats = [
  { key: "statTitle1", valueKey: "statValue1", value: 50000, suffix: "+" },
  { key: "statTitle2", valueKey: "statValue2", value: 10000, suffix: "+" },
  { key: "statTitle3", valueKey: "statValue3", value: 5000, suffix: "+" },
  { key: "statTitle4", valueKey: "statValue4", value: 50, suffix: "+" },
];

function StatCard({ title, value, suffix }: { title: string; value: number; suffix?: string }) {
  const ref = useGsapCounter(value);

  return (
    <Card className="text-center">
      <CardContent className="p-6">
        <span className="text-3xl font-bold text-primary" ref={ref}>0</span>
        {suffix && <span className="text-3xl font-bold text-primary">{suffix}</span>}
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  const { t } = useLocale();
  const headerRef = useGsapFadeIn();
  const missionRef = useGsapFadeIn(0.15);
  const valuesRef = useGsapFadeIn(0.25);
  const statsRef = useGsapFadeIn(0.35);

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("about.title")} subtitle={t("about.subtitle")} />
      </div>

      <div ref={missionRef} className="grid gap-6 md:grid-cols-2 mb-12">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{t("about.missionTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("about.missionDesc")}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{t("about.visionTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("about.visionDesc")}</p>
          </CardContent>
        </Card>
      </div>

      <div ref={valuesRef} className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          {t("about.valuesTitle")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <Card key={v.key} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <v.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{t(`about.${v.key}Title`)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t(`about.${v.key}Desc`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div ref={statsRef}>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t("common.appName")} {t("common.bookmark")}s
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard
              key={s.key}
              title={t(`about.${s.key}`)}
              value={s.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
