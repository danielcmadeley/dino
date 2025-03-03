"use client";

import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const FormSchema = z.object({
  fullname: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s-']+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes"
    ),
  email: z
    .string()
    .email("Please enter a valid email")
    .min(5, "Email must be at least 5 characters")
    .max(254, "Email must be less than 254 characters"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters")
    .trim(),
  budget: z
    .string()
    .regex(
      /^\$?\d+(?:,\d{3})*(?:\.\d{2})?$/,
      "Please enter a valid currency amount (e.g. $1,000 or 1000)"
    )
    .transform((val) => val.replace(/[£,]/g, "")),
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be less than 100 characters")
    .trim(),
  projectDescription: z
    .string()
    .min(50, "Please provide at least 50 characters describing your project")
    .max(1000, "Project description must be less than 1000 characters")
    .trim(),
});

type FormData = z.infer<typeof FormSchema>;

export default function ProjectInquiryForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });
  const [state, setState] = useState({
    isSubmitted: false,
    isError: false,
    isLoading: false,
  });

  const onSubmit = async (data: FormData) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch("/api/project-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Project inquiry submission failed");
      }

      setState({
        isSubmitted: true,
        isError: false,
        isLoading: false,
      });

      reset();

      toast({
        title: "Project inquiry submitted!",
        description: "We'll get back to you soon.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setState({
        isSubmitted: false,
        isError: true,
        isLoading: false,
      });

      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again later.",
        duration: 5000,
      });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="relative w-full h-full max-w-[900px] min-h-screen mx-auto border-x border-stone-900 dark:border-stone-400 bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-stone-50 dark:bg-stone-900" />
      <div className="relative z-10 w-full flex flex-col">
        <motion.div
          variants={slideUp}
          className=" p-4 sm:p-6 flex flex-col items-center gap-2"
        >
          <h2 className="text-2xl sm:text-3xl font-nanum text-center">
            Start Your Project
          </h2>
          <div>
            <p className="text-stone-600 text-sm font-karla text-center px-4">
              Tell us about your project and we&apos;ll get back to you with a
              custom solution.
            </p>
          </div>
        </motion.div>
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <motion.div
            variants={staggerChildren}
            className="w-full max-w-2xl mx-auto"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <motion.div variants={staggerChildren} className="space-y-4">
                <motion.div variants={slideUp}>
                  <div>
                    <label
                      htmlFor="fullname"
                      className="block text-xs font-karla mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullname"
                      placeholder="John Doe"
                      className={`w-full px-3 sm:px-4 py-2 bg-transparent rounded-sm border text-base ${
                        errors.fullname
                          ? "border-red-500"
                          : "border-stone-900 dark:border-stone-500"
                      } focus:outline-none focus:ring-1 focus:ring-[#2EA8A9] font-karla transition-colors duration-200`}
                      {...register("fullname")}
                    />
                    {errors.fullname && (
                      <p className="mt-1 text-xs text-red-500 font-karla">
                        {errors.fullname.message}
                      </p>
                    )}
                  </div>
                </motion.div>
                <motion.div variants={slideUp}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-karla mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className={`w-full px-4 py-2 bg-transparent rounded-sm border ${
                        errors.email
                          ? "border-red-500"
                          : "border-stone-900 dark:border-stone-500"
                      } focus:outline-none focus:ring-1 focus:ring-[#2EA8A9] font-karla transition-colors duration-200`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 font-karla">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </motion.div>
                <motion.div variants={slideUp}>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-karla mb-2"
                    >
                      Company Name
                    </label>
                    <input
                      id="company"
                      placeholder="Acme Inc."
                      className={`w-full px-4 py-2 bg-transparent rounded-sm border ${
                        errors.company
                          ? "border-red-500"
                          : "border-stone-900 dark:border-stone-500"
                      } focus:outline-none focus:ring-1 focus:ring-[#2EA8A9] font-karla transition-colors duration-200`}
                      {...register("company")}
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-500 font-karla">
                        {errors.company.message}
                      </p>
                    )}
                  </div>
                </motion.div>
                <motion.div variants={slideUp}>
                  <div>
                    <label
                      htmlFor="budget"
                      className="block text-sm font-karla mb-2"
                    >
                      Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600">
                        £
                      </span>
                      <input
                        id="budget"
                        placeholder="10,000"
                        className={`w-full pl-8 pr-4 py-2 bg-transparent rounded-sm border ${
                          errors.budget
                            ? "border-red-500"
                            : "border-stone-900 dark:border-stone-500"
                        } focus:outline-none focus:ring-1 focus:ring-[#2EA8A9] font-karla transition-colors duration-200`}
                        {...register("budget")}
                      />
                    </div>
                    {errors.budget && (
                      <p className="mt-1 text-xs text-red-500 font-karla">
                        {errors.budget.message}
                      </p>
                    )}
                  </div>
                </motion.div>
                <motion.div variants={slideUp}>
                  <div>
                    <label
                      htmlFor="projectName"
                      className="block text-sm font-karla mb-2"
                    >
                      Project Name
                    </label>
                    <input
                      id="projectName"
                      placeholder="My Awesome Project"
                      className={`w-full px-4 py-2 bg-transparent rounded-sm border ${
                        errors.projectName
                          ? "border-red-500"
                          : "border-stone-900 dark:border-stone-500"
                      } focus:outline-none focus:ring-1 focus:ring-[#2EA8A9] font-karla transition-colors duration-200`}
                      {...register("projectName")}
                    />
                    {errors.projectName && (
                      <p className="mt-1 text-xs text-red-500 font-karla">
                        {errors.projectName.message}
                      </p>
                    )}
                  </div>
                </motion.div>
                <motion.div variants={slideUp}>
                  <div>
                    <label
                      htmlFor="projectDescription"
                      className="block text-sm font-karla mb-2"
                    >
                      Project Description
                    </label>
                    <textarea
                      id="projectDescription"
                      placeholder="Please describe your project in detail..."
                      rows={3}
                      className={`w-full px-4 py-2 bg-transparent rounded-sm border ${
                        errors.projectDescription
                          ? "border-red-500"
                          : "border-stone-900 dark:border-stone-500"
                      } focus:outline-none focus:ring-1 focus:ring-[#2EA8A9] font-karla transition-colors duration-200`}
                      {...register("projectDescription")}
                    />
                    {errors.projectDescription && (
                      <p className="mt-1 text-xs text-red-500 font-karla">
                        {errors.projectDescription.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
              <motion.div variants={slideUp} className="pt-4">
                <button
                  type="submit"
                  disabled={state.isLoading}
                  className="w-full bg-[#2EA8A9] text-white py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base hover:bg-[#237e7e] transition-colors duration-200 font-karla disabled:opacity-50 border border-stone-900 disabled:cursor-not-allowed flex items-center justify-center rounded-sm"
                >
                  {state.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Project Inquiry"
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
      <Toaster />
    </motion.div>
  );
}
