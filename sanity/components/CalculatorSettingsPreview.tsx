"use client";

import { Badge, Box, Card, Flex, Grid, Select, Stack, Switch, Text } from "@sanity/ui";
import { useState } from "react";
import { useFormValue } from "sanity";
import {
  battery as calcBattery,
  bundle as calcBundle,
  ev as calcEv,
  solar as calcSolar,
  CALC_CONFIG,
  type CalcResult,
} from "@/lib/calculator";
import { buildCalcConfig, type CalculatorSettings } from "@/lib/calcConfig";

export function CalculatorSettingsPreview() {
  const doc = (useFormValue([]) || {}) as CalculatorSettings;
  const cfg = buildCalcConfig(doc);

  // Sample scenario the preview prices — editable so you can sanity-check your
  // settings across property sizes, roof aspects and bundle combinations.
  const [beds, setBeds] = useState(1); // 3 bed
  const [orient, setOrient] = useState(0); // South
  const [bill, setBill] = useState(1400);
  const [cap, setCap] = useState(10);
  const [evPower, setEvPower] = useState(0); // 7 kW
  const [evSmart, setEvSmart] = useState(true);
  const [evUntethered, setEvUntethered] = useState(false);
  const [evLongRun, setEvLongRun] = useState(false);
  const [bSolar, setBSolar] = useState(true);
  const [bBattery, setBBattery] = useState(true);
  const [bEv, setBEv] = useState(true);

  const solarInput = { beds, orient, bill };
  const batteryInput = { cap, hasSolar: true };
  const evInput = {
    power: evPower,
    mount: evUntethered ? 1 : 0,
    smart: evSmart,
    longRun: evLongRun,
  };

  const solarResult = calcSolar(solarInput, cfg);
  const batteryResult = calcBattery(batteryInput, cfg);
  const evResult = calcEv(evInput, cfg);
  const bundleResult = calcBundle(
    {
      solar: bSolar,
      battery: bBattery,
      ev: bEv,
      solarInput,
      batteryInput,
      evInput,
    },
    cfg
  );

  return (
    <Card border radius={3} padding={4} tone="primary">
      <Stack space={4}>
        <Flex align="center" gap={3} wrap="wrap">
          <Text size={2} weight="semibold">
            Live calculator preview
          </Text>
          <Badge tone="primary">Draft values</Badge>
        </Flex>
        <Text muted size={1}>
          These use the exact same pricing logic as the live website. Change the
          settings below and the estimates update instantly. Adjust the sample
          scenario to check how your figures behave across different homes.
        </Text>

        {/* Sample scenario controls */}
        <Card border radius={2} padding={4} tone="default">
          <Stack space={4}>
            <Text size={1} weight="semibold" muted>
              SAMPLE SCENARIO
            </Text>
            <Grid columns={[1, 2, 3]} gap={4}>
              <Field label="Property size">
                <Select
                  value={String(beds)}
                  onChange={(e) => setBeds(Number(e.currentTarget.value))}
                  fontSize={1}
                >
                  {CALC_CONFIG.solar.bedLabels.map((label, i) => (
                    <option key={label} value={i}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Roof orientation">
                <Select
                  value={String(orient)}
                  onChange={(e) => setOrient(Number(e.currentTarget.value))}
                  fontSize={1}
                >
                  {CALC_CONFIG.solar.orientLabels.map((label, i) => (
                    <option key={label} value={i}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Electricity bill / yr">
                <Select
                  value={String(bill)}
                  onChange={(e) => setBill(Number(e.currentTarget.value))}
                  fontSize={1}
                >
                  {[0, 400, 800, 1200, 1400, 2000, 3000, 4000].map((v) => (
                    <option key={v} value={v}>
                      £{v.toLocaleString("en-GB")}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Battery capacity">
                <Select
                  value={String(cap)}
                  onChange={(e) => setCap(Number(e.currentTarget.value))}
                  fontSize={1}
                >
                  {[5, 10, 15, 20].map((v) => (
                    <option key={v} value={v}>
                      {v} kWh
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="EV charger power">
                <Select
                  value={String(evPower)}
                  onChange={(e) => setEvPower(Number(e.currentTarget.value))}
                  fontSize={1}
                >
                  {CALC_CONFIG.ev.powerKw.map((kw, i) => (
                    <option key={kw} value={i}>
                      {kw} kW
                    </option>
                  ))}
                </Select>
              </Field>
            </Grid>

            <Stack space={3}>
              <Text size={1} weight="semibold" muted>
                EV OPTIONS
              </Text>
              <Grid columns={[1, 3]} gap={3}>
                <ToggleField
                  label="Smart charging"
                  checked={evSmart}
                  onChange={setEvSmart}
                />
                <ToggleField
                  label="Untethered cable"
                  checked={evUntethered}
                  onChange={setEvUntethered}
                />
                <ToggleField
                  label="Extended cable run"
                  checked={evLongRun}
                  onChange={setEvLongRun}
                />
              </Grid>
            </Stack>

            <Stack space={3}>
              <Text size={1} weight="semibold" muted>
                INCLUDE IN BUNDLE
              </Text>
              <Grid columns={[1, 3]} gap={3}>
                <ToggleField label="Solar" checked={bSolar} onChange={setBSolar} />
                <ToggleField
                  label="Battery"
                  checked={bBattery}
                  onChange={setBBattery}
                />
                <ToggleField label="EV charger" checked={bEv} onChange={setBEv} />
              </Grid>
            </Stack>
          </Stack>
        </Card>

        {/* Estimates */}
        <Grid columns={[1, 2]} gap={3}>
          <PreviewCard title="Solar" result={solarResult} />
          <PreviewCard title="Battery" result={batteryResult} />
          <PreviewCard title="EV charger" result={evResult} />
          <PreviewCard title="Bundle" result={bundleResult} />
        </Grid>
      </Stack>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Stack space={3}>
      <Text size={1} muted>
        {label}
      </Text>
      {children}
    </Stack>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Flex align="center" gap={3}>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <Text size={1}>{label}</Text>
    </Flex>
  );
}

function PreviewCard({
  title,
  result,
}: {
  title: string;
  result: CalcResult;
}) {
  return (
    <Card border radius={3} padding={4} tone="default">
      <Stack space={4}>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            {title}
          </Text>
          <Text size={0} muted>
            {result.priceLabel}
          </Text>
          <Text size={5} weight="bold">
            {result.price}
          </Text>
        </Stack>
        <Stack space={3}>
          {result.stats.map((stat) => (
            <Flex
              key={stat.label}
              align="flex-start"
              justify="space-between"
              gap={4}
            >
              <Box flex={1}>
                <Text muted size={1}>
                  {stat.label}
                </Text>
              </Box>
              <Box flex={1}>
                <Text size={1} weight="semibold" align="right">
                  {stat.value}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
