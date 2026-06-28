import { defineField, defineType } from "sanity";
import { CalculatorSettingsPreview } from "../components/CalculatorSettingsPreview";

export const pricingCalculatorSettings = defineType({
  name: "pricingCalculatorSettings",
  title: "Pricing calculator settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Pricing calculator",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "calculatorPreview",
      title: "Preview",
      type: "string",
      readOnly: true,
      components: {
        input: CalculatorSettingsPreview,
      },
    }),
    defineField({
      name: "solar",
      title: "Solar",
      description:
        "Pricing and savings assumptions for solar panel installations.",
      type: "object",
      fields: [
        defineField({
          name: "costLoPerKwp",
          title: "Low cost per kWp",
          description:
            "Lower end of the installed price range, in £ per kW of panels (kWp). Multiplied by the system size to give the low price shown to visitors.",
          type: "number",
          initialValue: 1500,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "costHiPerKwp",
          title: "High cost per kWp",
          description:
            "Upper end of the installed price range, in £ per kWp. Should be higher than the low cost above.",
          type: "number",
          initialValue: 1900,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "yieldPerKwp",
          title: "Annual yield per kWp",
          description:
            "Expected electricity generated per year (kWh) for each kWp installed, on a south-facing roof. Typical UK value is 850–1,000.",
          type: "number",
          initialValue: 950,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "tariff",
          title: "Electricity value per kWh",
          description:
            "What each kWh of solar generation is worth, in £. Used with the annual yield above to estimate yearly savings.",
          type: "number",
          initialValue: 0.22,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "billSavingCap",
          title: "Max bill saving ratio",
          description:
            "Stops the estimated saving exceeding this share of the customer's bill. E.g. 0.9 means savings are capped at 90% of what they currently pay.",
          type: "number",
          initialValue: 0.9,
          validation: (Rule) => Rule.required().min(0).max(1),
        }),
      ],
    }),
    defineField({
      name: "battery",
      title: "Battery",
      description: "Pricing and savings assumptions for battery storage.",
      type: "object",
      fields: [
        defineField({
          name: "costLoPerKwh",
          title: "Low cost per kWh",
          description:
            "Lower end of the installed price range, in £ per kWh of battery capacity.",
          type: "number",
          initialValue: 750,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "costHiPerKwh",
          title: "High cost per kWh",
          description:
            "Upper end of the installed price range, in £ per kWh of battery capacity.",
          type: "number",
          initialValue: 950,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "savePerKwhSolar",
          title: "Annual saving per kWh with solar",
          description:
            "Yearly saving in £ for each kWh of battery capacity, when the customer also has solar panels (battery stores their own generation).",
          type: "number",
          initialValue: 70,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "savePerKwhNoSolar",
          title: "Annual saving per kWh without solar",
          description:
            "Yearly saving in £ for each kWh of battery capacity, when used on its own (e.g. charging on a cheap off-peak tariff).",
          type: "number",
          initialValue: 45,
          validation: (Rule) => Rule.required().min(0),
        }),
      ],
    }),
    defineField({
      name: "ev",
      title: "EV charging",
      description: "Pricing for EV charger installations and add-ons.",
      type: "object",
      fields: [
        defineField({
          name: "base7kw",
          title: "7 kW base install price",
          description: "Fully installed price for a 7 kW tethered charger, before any add-ons below.",
          type: "number",
          initialValue: 899,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "base22kw",
          title: "22 kW base install price",
          description: "Fully installed price for a 22 kW tethered charger, before any add-ons below.",
          type: "number",
          initialValue: 1499,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "untetheredAdd",
          title: "Untethered add-on",
          description:
            "Extra cost added when the customer picks an untethered (socket-only) charger instead of tethered.",
          type: "number",
          initialValue: 60,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "smartAdd",
          title: "Smart charging add-on",
          description:
            "Extra cost added for smart, solar-aware charging that charges from their own generation or off-peak rates.",
          type: "number",
          initialValue: 170,
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "longRunAdd",
          title: "Extended cable run add-on",
          description:
            "Extra cost added when the charger is more than 10m from the consumer unit, requiring a longer cable run.",
          type: "number",
          initialValue: 220,
          validation: (Rule) => Rule.required().min(0),
        }),
      ],
    }),
    defineField({
      name: "bundle",
      title: "Bundle",
      description:
        "Discount applied when a customer combines two or more services.",
      type: "object",
      fields: [
        defineField({
          name: "discountRate",
          title: "Discount rate",
          description:
            "Discount applied to the combined installation price when the bundle qualifies. Use 0.08 for 8%.",
          type: "number",
          initialValue: 0.08,
          validation: (Rule) => Rule.required().min(0).max(1),
        }),
        defineField({
          name: "discountMinItems",
          title: "Minimum selected services for discount",
          description:
            "How many services (Solar / Battery / EV) a customer must select together before the discount above applies.",
          type: "number",
          initialValue: 2,
          validation: (Rule) => Rule.required().integer().min(1),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Pricing calculator settings",
        subtitle: "Editable estimate assumptions",
      };
    },
  },
});
