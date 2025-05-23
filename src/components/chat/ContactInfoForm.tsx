import React, { useState, useRef } from "react";

interface ContactInfoFormProps {
  initialValues?: {
    email?: string;
    github?: string;
    telegram?: string;
    x?: string;
  };
  onSubmit: (values: {
    email: string;
    github: string;
    telegram: string;
    x: string;
  }) => void;
  isSubmitting?: boolean;
}

const validateEmail = (email: string) => /.+@.+\..+/.test(email.trim());

export function ContactInfoForm({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
}: ContactInfoFormProps) {
  const [values, setValues] = useState({
    email: initialValues.email || "",
    github: initialValues.github || "",
    telegram: initialValues.telegram || "",
    x: initialValues.x || "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    github?: string;
    telegram?: string;
    x?: string;
  }>({});

  // Refs for each input
  const emailRef = useRef<HTMLInputElement>(null);
  const githubRef = useRef<HTMLInputElement>(null);
  const telegramRef = useRef<HTMLInputElement>(null);
  const xRef = useRef<HTMLInputElement>(null);

  // Focus the email field on mount
  React.useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: string,
  ) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (field === "email") {
        githubRef.current?.focus();
      } else if (field === "github") {
        telegramRef.current?.focus();
      } else if (field === "telegram") {
        xRef.current?.focus();
      } else if (field === "x") {
        // Submit the form if on last field
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const newErrors: typeof errors = {};
    if (!validateEmail(values.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    // Optionally add more validation for handles if needed
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <div className="w-full flex justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-[#232b3a] border-none rounded-xl p-6 flex flex-col gap-4"
          autoComplete="off"
        >
          <div>
            <label
              className="block text-sm font-medium text-white mb-1"
              htmlFor="email"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 rounded bg-[#2a2a2a] border-none text-white placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={values.email}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, "email")}
              disabled={isSubmitting}
              required
              ref={emailRef}
              autoFocus
            />
            {errors.email && (
              <div className="text-red-400 text-xs mt-1">{errors.email}</div>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-white mb-1"
              htmlFor="github"
            >
              GitHub Username (optional)
            </label>
            <input
              id="github"
              name="github"
              type="text"
              className="w-full px-3 py-2 rounded bg-[#2a2a2a] border-none text-white placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={values.github}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, "github")}
              disabled={isSubmitting}
              placeholder="e.g. andromedaprotocol"
              ref={githubRef}
            />
            {errors.github && (
              <div className="text-red-400 text-xs mt-1">{errors.github}</div>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-white mb-1"
              htmlFor="telegram"
            >
              Telegram Handle (optional)
            </label>
            <input
              id="telegram"
              name="telegram"
              type="text"
              className="w-full px-3 py-2 rounded bg-[#2a2a2a] border-none text-white placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={values.telegram}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, "telegram")}
              disabled={isSubmitting}
              placeholder="@andromedafanatic"
              ref={telegramRef}
            />
            {errors.telegram && (
              <div className="text-red-400 text-xs mt-1">{errors.telegram}</div>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-white mb-1"
              htmlFor="x"
            >
              X/Twitter Handle (optional)
            </label>
            <input
              id="x"
              name="x"
              type="text"
              className="w-full px-3 py-2 rounded bg-[#2a2a2a] border-none text-white placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={values.x}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, "x")}
              disabled={isSubmitting}
              placeholder="@andromedaprot"
              ref={xRef}
            />
            {errors.x && (
              <div className="text-red-400 text-xs mt-1">{errors.x}</div>
            )}
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60 border-none"
            disabled={isSubmitting}
          >
            Submit Contact Info
          </button>
        </form>
      </div>
    </div>
  );
}
