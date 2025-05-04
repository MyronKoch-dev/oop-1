import React, { useState } from "react";

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

const validateEmail = (email: string) =>
    /.+@.+\..+/.test(email.trim());

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
        <form
            onSubmit={handleSubmit}
            className="bg-[#232b3a] border border-[#444] rounded-xl p-6 flex flex-col gap-4 shadow-lg"
            autoComplete="off"
        >
            <div>
                <label className="block text-sm font-medium text-white mb-1" htmlFor="email">
                    Email <span className="text-red-400">*</span>
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full px-3 py-2 rounded bg-[#2a2a2a] border border-[#444] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={values.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                />
                {errors.email && (
                    <div className="text-red-400 text-xs mt-1">{errors.email}</div>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-white mb-1" htmlFor="github">
                    GitHub Username (optional)
                </label>
                <input
                    id="github"
                    name="github"
                    type="text"
                    className="w-full px-3 py-2 rounded bg-[#2a2a2a] border border-[#444] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={values.github}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g. octocat"
                />
                {errors.github && (
                    <div className="text-red-400 text-xs mt-1">{errors.github}</div>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-white mb-1" htmlFor="telegram">
                    Telegram Handle (optional)
                </label>
                <input
                    id="telegram"
                    name="telegram"
                    type="text"
                    className="w-full px-3 py-2 rounded bg-[#2a2a2a] border border-[#444] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={values.telegram}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="@yourhandle"
                />
                {errors.telegram && (
                    <div className="text-red-400 text-xs mt-1">{errors.telegram}</div>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-white mb-1" htmlFor="x">
                    X/Twitter Handle (optional)
                </label>
                <input
                    id="x"
                    name="x"
                    type="text"
                    className="w-full px-3 py-2 rounded bg-[#2a2a2a] border border-[#444] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={values.x}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="@yourhandle"
                />
                {errors.x && (
                    <div className="text-red-400 text-xs mt-1">{errors.x}</div>
                )}
            </div>
            <button
                type="submit"
                className="w-full mt-2 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60"
                disabled={isSubmitting}
            >
                Submit Contact Info
            </button>
        </form>
    );
} 