"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { TextArea } from "../ui/TextArea";

interface EnquiryFormProps {
  compact?: boolean;
  defaultProductCategory?: string;
  onSuccess?: () => void;
}

export function EnquiryForm({
  compact = false,
  defaultProductCategory = "",
  onSuccess,
}: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    productInterest: defaultProductCategory,
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const recaptchaSiteKey =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
    "6LfjIAMuAAAAAHUoRY06pc25tYsXFsybq2JgayT8";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (submitError) setSubmitError(null);
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message or requirements";
    }
    if (recaptchaSiteKey && !captchaToken && !captchaError) {
      newErrors.captcha = "Please complete the reCAPTCHA verification";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const serviceId =
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_gxwp9lr";
    const templateId =
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_7flq5b6";
    const publicKey =
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "KYJx_rUIHX9fjFQGT";

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          full_name: formData.fullName,
          name: formData.fullName,
          from_name: formData.fullName,
          email: formData.email,
          from_email: formData.email,
          reply_to: formData.email,
          title: `Product Enquiry from ${formData.fullName} (${formData.productInterest || "General"})`,
          company: formData.company || "Not provided",
          product_category: formData.productInterest || "General Product Enquiry",
          message: formData.message,
          "g-recaptcha-response": captchaToken || "",
        },
        publicKey,
      );

      setIsSuccess(true);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setFormData({
        fullName: "",
        email: "",
        company: "",
        productInterest: defaultProductCategory,
        message: "",
      });
      onSuccess?.();
    } catch (err: unknown) {
      console.error("EmailJS submission failed:", err);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setSubmitError(
        "Failed to send your enquiry via email. Please check your connection or contact us directly at info@biotech-int.com.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 p-8 rounded-xl text-center border border-green-100"
      >
        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
          Enquiry Sent Successfully!
        </h3>
        <p className="text-gray-600 mb-6 font-lato">
          Thank you for reaching out. Our product specialists have received your
          inquiry and will contact you shortly.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          Send Another Enquiry
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${
        compact ? "p-6 bg-white rounded-xl shadow-lg border border-gray-100" : ""
      }`}
    >
      {!compact && (
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 font-poppins">
            Need Help Finding the Right Product?
          </h3>
          <p className="text-gray-600 font-lato text-sm">
            Our specialists can guide you to the ideal biological solution.
          </p>
        </div>
      )}

      {submitError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <span>{submitError}</span>
        </div>
      )}

      <div
        className={`grid gap-4 ${
          compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        <Input
          label="Full Name *"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          required
        />
        <Input
          label="Email Address *"
          type="email"
          name="email"
          placeholder="john@company.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      </div>

      <div
        className={`grid gap-4 ${
          compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        <Input
          label="Company / Organization"
          name="company"
          placeholder="Farm Co."
          value={formData.company}
          onChange={handleChange}
        />
        <Select
          label="Product Interest"
          name="productInterest"
          value={formData.productInterest}
          onChange={handleChange}
          options={[
            { value: "", label: "Select a category..." },
            { value: "Agriculture Solutions", label: "Agriculture Solutions" },
            { value: "Public Health Solutions", label: "Public Health Solutions" },
            { value: "Biopesticides", label: "Biopesticides" },
            { value: "Biofertilizers", label: "Biofertilizers" },
            { value: "Biofungicides", label: "Biofungicides" },
            { value: "Biolarvicides", label: "Biolarvicides" },
            { value: "Bulk Manufacturing", label: "Bulk Manufacturing" },
            { value: "Other Inquiry", label: "Other Inquiry" },
          ]}
        />
      </div>

      <TextArea
        label="Message"
        name="message"
        placeholder="Tell us about your requirements..."
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        rows={3}
        required
      />

      {recaptchaSiteKey && (
        <div className="flex flex-col items-center justify-center my-2">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={recaptchaSiteKey}
            onErrored={() => setCaptchaError(true)}
            onChange={(token) => {
              setCaptchaToken(token);
              if (errors.captcha) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.captcha;
                  return next;
                });
              }
            }}
          />
          {errors.captcha && (
            <p className="mt-1 text-sm text-red-600 text-center">
              {errors.captcha}
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full py-2.5 bg-biotech-green hover:bg-biotech-dark text-white font-medium"
        isLoading={isSubmitting}
        rightIcon={!isSubmitting && <Send className="w-4 h-4" />}
      >
        {isSubmitting ? "Sending Enquiry..." : "Send Enquiry"}
      </Button>
    </form>
  );
}
