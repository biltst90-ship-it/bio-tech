"use client";

import React, { useState, useRef } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { TextArea } from "../ui/TextArea";

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    country: "",
    email: "",
    phone: "",
    productCategory: undefined,
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim())
      newErrors.message = "Please enter your message";
    if (!captchaToken && !captchaError)
      newErrors.captcha = "Please complete the reCAPTCHA verification";
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
          title: `New Enquiry from ${formData.fullName} (${formData.productCategory || "General"})`,
          company: formData.company || "Not provided",
          country: formData.country || "Not provided",
          phone: formData.phone || "Not provided",
          product_category: formData.productCategory || "General Inquiry",
          message: formData.message,
          "g-recaptcha-response": captchaToken,
        },
        publicKey,
      );

      setIsSuccess(true);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setFormData({
        fullName: "",
        company: "",
        country: "",
        email: "",
        phone: "",
        productCategory: undefined,
        message: "",
      });
    } catch (err: unknown) {
      console.error("EmailJS submission failed:", err);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setSubmitError(
        "Failed to send your message via email. Please check your network or try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const productCategories = [
    {
      value: "",
      label: "Select a category",
    },
    {
      value: "biopesticides",
      label: "Biopesticides",
    },
    {
      value: "biofertilizers",
      label: "Biofertilizers",
    },
    {
      value: "biofungicides",
      label: "Biofungicides",
    },
    {
      value: "biostimulants",
      label: "Biostimulants",
    },
    {
      value: "bionematicides",
      label: "Bionematicides",
    },
    {
      value: "public-health",
      label: "Public Health Products",
    },
    {
      value: "other",
      label: "Other Inquiry",
    },
  ];

  return (
    <section id="contact-form" className="py-16 bg-molecular">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Form Side */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Send Us an Enquiry
              </h2>
              <p className="mt-3 text-gray-600">
                Whether you're interested in our biological products, want to
                collaborate, or need technical details — fill out the form and
                our team will get in touch.
              </p>
            </div>

            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold">Submission Error</p>
                  <p>{submitError}</p>
                </div>
              </div>
            )}

            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fade-in">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Enquiry Sent Successfully!
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Thank you for reaching out to Biotech International Ltd. Our
                  team has received your enquiry and will review it and respond
                  shortly.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setIsSuccess(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    placeholder="Dr. John Doe"
                    required
                  />
                  <Input
                    label="Company / Organization"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Biotech Labs Inc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="john@example.com"
                    required
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                  />
                  <Select
                    label="Product Category"
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    options={productCategories}
                    placeholder="Select a category"
                  />
                </div>

                <TextArea
                  label="Message / Enquiry Details"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  placeholder="Please describe your requirements or questions..."
                  required
                  rows={5}
                />

                <div className="pt-2 space-y-4">
                  <div className="flex flex-col">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      onErrored={() => setCaptchaError(true)}
                      sitekey={
                        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                        "6LfjIAMuAAAAAHUoRY06pc25tYsXFsybq2JgayT8"
                      }
                      onChange={(token) => {
                        setCaptchaToken(token);
                        if (errors.captcha) {
                          setErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.captcha;
                            return updated;
                          });
                        }
                      }}
                      onExpired={() => setCaptchaToken(null)}
                    />
                    {errors.captcha && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">
                        {errors.captcha}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full md:w-auto min-w-[200px]"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="h-4 w-4" />}
                  >
                    Submit Enquiry
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Visual Side */}
          <div className="lg:col-span-2 hidden lg:block h-full min-h-[600px] relative rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-biotech-green to-biotech-dark opacity-90 mix-blend-multiply z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Biotech Laboratory Research"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 text-white">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-2">Global Reach</h3>
                <p className="text-gray-100 text-sm leading-relaxed">
                  Exporting sustainable biological solutions to over 50
                  countries worldwide. Join our network of partners committed to
                  greener agriculture.
                </p>
              </div>
            </div>
            {/* Molecular overlay pattern */}
            <div
              className="absolute inset-0 z-10 opacity-20"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};
