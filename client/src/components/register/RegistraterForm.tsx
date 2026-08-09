"use client";

import { registerSchema } from "@/lib/validations/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegistraterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Registration Response:", result);
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return (
    <>
      <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-1">Create Your Account</h1>
        <p className="text-sm text-slate-400 mb-6">
          Welcome! Please create your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
              {...register("name")}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email")}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              {...register("password")}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-lg transition"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
      ;
    </>
  );
};

export default RegistraterForm;
