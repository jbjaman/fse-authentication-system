const RegistraterForm = () => {
  return (
    <div>
      <h1>Create Your Account</h1>
      <p>Welcome! Please create your account</p>
      <form>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Enter your password"
            autoComplete="new-password"
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistraterForm;
