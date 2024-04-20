import { TextInput, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../Slices/userSlice";
import { useNavigate } from "react-router-dom";


const SignIn = () => {
  const dispatch = useDispatch();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "waiminhein@gmail.com",
      password: "11111111",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8 ? "Password must be at least 8 letters" : null,
    },
  });
  const handleLogin = async (datas) => {
    dispatch(signInStart());
    try {
      const res = await axios.post("https://income-expense-utqh.onrender.com/api/auth", datas);
      console.log(res.data.user);
      dispatch(signInSuccess(res.data.user));
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error.message));
    }
  };

  const nav = useNavigate()
  return (
    <div>
      <h1 className="text-center">Login</h1>

      <Box maw={340} mx="auto">
        <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
          <TextInput
            required
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />

          <TextInput
            required
            withAsterisk
            label="Password"
            placeholder="Enter your Password"
            {...form.getInputProps("password")}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>

      <div className="flex justify-center mt-8">
        <p>Don`t you have an ccount? <span className="cursor-pointer" onClick={() => nav('/signUp')}>Sing Up</span> here.</p>
      </div>
    </div>
  );
};

export default SignIn;
