export const registerService = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  console.log(data);

  return {
    message: "Registration service is working",
  };
};
