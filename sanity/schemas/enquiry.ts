import { defineField, defineType } from "sanity";

export const enquiry = defineType({
  name: "enquiry",
  title: "Contact enquiry",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Quoted", value: "quoted" },
          { title: "Won", value: "won" },
          { title: "Lost", value: "lost" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "service",
      title: "Service",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "estimate",
      title: "Calculator estimate",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 5,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "service",
      status: "status",
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title || "Website enquiry",
        subtitle: [status, subtitle].filter(Boolean).join(" - "),
      };
    },
  },
});
