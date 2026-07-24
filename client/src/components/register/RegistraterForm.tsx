"use client";

import { useForm } from "react-hook-form";

const RegistraterForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <h1>Create Your Account</h1>
      <p>Welcome! Please create your account</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
            {...register("name")}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            {...register("email")}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="new-password"
            {...register("password")}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Enter your password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistraterForm;
