import { createClient } from "next-sanity";
import { apiVersion, dataset, hasSanityProject, projectId } from "../../../sanity/env";

export type SanityEnquiryInput = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  estimate: string;
};

const token = process.env.SANITY_API_WRITE_TOKEN;

export const canWriteToSanity = hasSanityProject && Boolean(token);

const writeClient = canWriteToSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    })
  : null;

export async function createSanityEnquiry(data: SanityEnquiryInput) {
  if (!writeClient) return null;

  return writeClient.create({
    _type: "enquiry",
    status: "new",
    submittedAt: new Date().toISOString(),
    name: data.name,
    phone: data.phone,
    email: data.email,
    service: data.service,
    message: data.message,
    estimate: data.estimate,
  });
}
