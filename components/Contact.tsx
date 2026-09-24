"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";
import emailjs from "@emailjs/browser";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Client-side validation — no dangerouslySetInnerHTML, no eval
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "Please enter your name (min 2 characters)";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      newErrors.message = "Please enter your message (min 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(false);
    try {
      await emailjs.send(
        "service_rwrc7yx",
        "template_ujfto0d",
        {
          name: form.name,
          email: form.email,
          phone: form.phone || "Not provided",
          message: form.message,
        },
        "W30LfGGeD3ilFX9sf"
      );
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Sanitize: only allow safe text via controlled input (React auto-escapes)
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section
      id="contact"
      style={{
        background: "#080808",
        padding: "6rem 0 5rem",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background atmospheric glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(200,16,46,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="section-label"
          style={{ marginBottom: "1.5rem" }}
        >
          GET IN TOUCH
        </motion.div>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#f0ede8",
            fontFamily: "Geist, sans-serif",
            lineHeight: 0.95,
            marginBottom: "2.5rem",
          }}
        >
          LET&apos;S CREATE
          <br />
          <span style={{ color: "#c8102e" }}>SOMETHING</span>
          <br />
          EXTRAORDINARY
        </motion.h2>

        {/* Two-column: info + form */}
        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6rem",
            alignItems: "start",
          }}
        >
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p
              style={{
                fontSize: "1.125rem",
                color: "#888880",
                fontFamily: "Geist, sans-serif",
                fontWeight: 300,
                lineHeight: 1.8,
                marginBottom: "3rem",
              }}
            >
              Have a project in mind?
              <br />
              I&apos;d love to hear about it.
              <br />
              Let&apos;s build something amazing together.
            </p>

            {/* Contact details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { label: "EMAIL", value: personalInfo.email, href: `mailto:${personalInfo.email}` },
                { label: "PHONE", value: personalInfo.phone, href: `tel:${personalInfo.phone}` },
                { label: "LOCATION", value: personalInfo.location },
                { label: "AVAILABILITY", value: personalInfo.availability },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    paddingBottom: "1.5rem",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.5625rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "#444440",
                      fontFamily: "Geist, sans-serif",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        fontSize: "0.9375rem",
                        color: "#f0ede8",
                        fontFamily: "Geist, sans-serif",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "#c8102e";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "#f0ede8";
                      }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      style={{
                        fontSize: "0.9375rem",
                        color: "#f0ede8",
                        fontFamily: "Geist, sans-serif",
                      }}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "3rem",
                  border: "1px solid rgba(200,16,46,0.2)",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "1rem",
                    color: "#c8102e",
                  }}
                >
                  ✓
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#f0ede8",
                    fontFamily: "Geist, sans-serif",
                    marginBottom: "0.5rem",
                  }}
                >
                  Message sent!
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#888880",
                    fontFamily: "Geist, sans-serif",
                  }}
                >
                  Your email client should have opened. Looking forward to connecting.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
              >
                {/* Name */}
                <div className="form-field" style={{ marginBottom: "2rem" }}>
                  <label htmlFor="contact-name" className="form-label">
                    NAME
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="form-input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    maxLength={100}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      role="alert"
                      style={{
                        fontSize: "0.75rem",
                        color: "#c8102e",
                        fontFamily: "Geist, sans-serif",
                        marginTop: "0.4rem",
                      }}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="form-field" style={{ marginBottom: "2rem" }}>
                  <label htmlFor="contact-email" className="form-label">
                    EMAIL
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    maxLength={200}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      style={{
                        fontSize: "0.75rem",
                        color: "#c8102e",
                        fontFamily: "Geist, sans-serif",
                        marginTop: "0.4rem",
                      }}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="form-field" style={{ marginBottom: "2rem" }}>
                  <label htmlFor="contact-phone" className="form-label">
                    PHONE <span style={{ opacity: 0.4, fontSize: "0.65rem" }}>(OPTIONAL)</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="form-input"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={20}
                  />
                </div>

                {/* Message */}
                <div className="form-field" style={{ marginBottom: "2.5rem" }}>
                  <label htmlFor="contact-message" className="form-label">
                    MESSAGE
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="form-input"
                    placeholder="Tell me about your project..."
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    maxLength={2000}
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      role="alert"
                      style={{
                        fontSize: "0.75rem",
                        color: "#c8102e",
                        fontFamily: "Geist, sans-serif",
                        marginTop: "0.4rem",
                      }}
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  disabled={isSubmitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: isSubmitting ? "#7a0a1c" : "#c8102e",
                    color: "#fff",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    padding: "1rem 2rem",
                    borderRadius: "100px",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: "background 0.3s ease, transform 0.3s ease, opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.background = "#a50d26";
                    if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = isSubmitting ? "#7a0a1c" : "#c8102e";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  }}
                >
                  {isSubmitting ? "Sending..." : "Send Message →"}
                </button>
                {submitError && (
                  <p style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    ❌ Kuch error aaya, thodi der baad try karo.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
