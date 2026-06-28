import { defineField, defineType } from "sanity";

/** A captioned image field: the photo plus its alt text, in one place. */
function photoField(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        description: "Describes the photo for screen readers and SEO.",
      }),
    ],
  });
}

export const sitePhotos = defineType({
  name: "sitePhotos",
  title: "Site photos",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Site photos",
      validation: (Rule) => Rule.required(),
    }),
    photoField("hero", "Hero photo", "Homepage banner, top of the page."),
    photoField("about", "About section photo"),
    defineField({
      name: "services",
      title: "Services photos",
      type: "object",
      fields: [
        photoField("solar", "Solar panel installation"),
        photoField("battery", "Battery storage"),
        photoField("ev", "EV charging"),
        photoField("om", "O&M for solar"),
      ],
    }),
    defineField({
      name: "calculator",
      title: "Calculator background photos",
      description: "Backdrop photo behind each calculator tab.",
      type: "object",
      fields: [
        photoField("solar", "Solar tab"),
        photoField("battery", "Battery tab"),
        photoField("ev", "EV charging tab"),
        photoField("bundle", "Bundle tab"),
      ],
    }),
  ],
  preview: {
    select: { media: "hero" },
    prepare({ media }) {
      return {
        title: "Site photos",
        subtitle: "Homepage, about, services & calculator images",
        media,
      };
    },
  },
});
