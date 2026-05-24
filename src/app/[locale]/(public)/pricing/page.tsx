"use client";

import { useState } from "react";
import { Check, X, Sparkles, Star } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGsapFadeIn } from "@/hooks/use-gsap";

interface TierFeature {
  key: string;
  included: boolean;
}

interface PricingTier {
  nameKey: string;
  descKey: string;
  price: { monthly: string; yearly: string };
  features: TierFeature[];
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    nameKey: "freeName",
    descKey: "freeDesc",
    price: { monthly: "Rs. 0", yearly: "Rs. 0" },
    features: [
      { key: "freeFeature1", included: true },
      { key: "freeFeature2", included: true },
      { key: "freeFeature3", included: true },
      { key: "freeFeature4", included: true },
      { key: "basicFeature1", included: false },
      { key: "basicFeature5", included: false },
    ],
  },
  {
    nameKey: "basicName",
    descKey: "basicDesc",
    price: { monthly: "Rs. 499", yearly: "Rs. 4,999" },
    popular: true,
    features: [
      { key: "basicFeature1", included: true },
      { key: "basicFeature2", included: true },
      { key: "basicFeature3", included: true },
      { key: "basicFeature4", included: true },
      { key: "basicFeature5", included: true },
      { key: "premiumFeature2", included: false },
      { key: "premiumFeature6", included: false },
    ],
  },
  {
    nameKey: "premiumName",
    descKey: "premiumDesc",
    price: { monthly: "Rs. 999", yearly: "Rs. 9,999" },
    features: [
      { key: "premiumFeature1", included: true },
      { key: "premiumFeature2", included: true },
      { key: "premiumFeature3", included: true },
      { key: "premiumFeature4", included: true },
      { key: "premiumFeature5", included: true },
      { key: "premiumFeature6", included: true },
    ],
  },
];

export default function PricingPage() {
  const { t } = useLocale();
  const [yearly, setYearly] = useState(false);
  const headerRef = useGsapFadeIn();
  const gridRef = useGsapFadeIn(0.15);

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("pricing.title")} subtitle={t("pricing.subtitle")}>
          <div className="flex items-center gap-3 pt-2">
            <span className={`text-sm ${!yearly ? "font-medium" : "text-muted-foreground"}`}>
              {t("pricing.monthly")}
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                yearly ? "bg-primary" : "bg-input"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  yearly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${yearly ? "font-medium" : "text-muted-foreground"}`}>
              {t("pricing.yearly")}
            </span>
          </div>
        </PageHeader>
      </div>

      <div ref={gridRef} className="grid gap-6 md:grid-cols-3 items-start">
        {tiers.map((tier) => (
          <Card
            key={tier.nameKey}
            className={`relative flex flex-col ${
              tier.popular
                ? "border-primary shadow-lg md:scale-105"
                : ""
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default" className="px-4 py-1 text-xs">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {t("pricing.popular")}
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-xl">{t(`pricing.${tier.nameKey}`)}</CardTitle>
              <CardDescription>{t(`pricing.${tier.descKey}`)}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {yearly ? tier.price.yearly : tier.price.monthly}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{yearly ? t("pricing.yearly").toLowerCase() : t("pricing.monthly").toLowerCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature.key} className="flex items-start gap-3 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 mt-0.5 text-muted-foreground/50 shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground/50"}>
                      {t(`pricing.${feature.key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                variant={tier.popular ? "default" : "outline"}
                className="w-full"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t("pricing.getStarted")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
